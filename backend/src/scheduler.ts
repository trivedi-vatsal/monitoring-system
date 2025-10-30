import PgBoss from 'pg-boss'
import { app } from './app'
import { performHealthCheck } from './utils/health-checker'

let boss: PgBoss | null = null
let isStarted = false

// 🔹 Create (or reuse) a single PgBoss instance
function getBoss(): PgBoss {
  if (!boss) {
    const connectionString = app.get('postgresql') as unknown as string
    boss = new PgBoss({
      connectionString,
      application_name: 'health-check-scheduler'
    })

    boss.on('error', err => {
      console.error('[PG-BOSS ERROR]', err)
    })
  }
  return boss
}

// 🔹 Initialize and start PgBoss
export async function start() {
  const bossInstance = getBoss()

  if (!isStarted) {
    await bossInstance.start()
    isStarted = true
    console.log('✅ PgBoss started (scheduler + worker mode)')
  }

  try {
    const services = await app.service('client-services').find({
      query: { active: true, $select: ['id', 'name', 'cron_pattern'], $limit: 1000 },
      paginate: false
    })

    console.log(`📋 Found ${services.length} active services`)

    // Register workers for each service
    for (const service of services) {
      await registerWorker(service.id)
    }

    // Schedule recurring jobs for each service
    for (const service of services) {
      if (service.cron_pattern) {
        await scheduleJob(service.id, service.cron_pattern)
      }
    }

    console.log('✅ Scheduler initialized for all active services')
  } catch (err) {
    console.error('❌ Failed to initialize scheduler:', err)
  }
}

// 🔹 Register worker (one per queue)
export async function registerWorker(serviceId: string) {
  const bossInstance = getBoss()
  const queueName = `health-check-${serviceId}`

  try {
    await bossInstance.work(queueName, async jobs => {
      for (const job of jobs) {
        const { serviceId: jobServiceId } = job.data as { serviceId: string }
        console.log(`[WORKER] 🔁 Job ${job.id} started for ${queueName} (${jobServiceId})`)

        try {
          await performHealthCheck(jobServiceId)
          console.log(`[WORKER] ✅ Health check done for ${jobServiceId}`)
        } catch (err) {
          console.error(`[WORKER] ❌ Health check failed for ${jobServiceId}`, err)
          throw err // pg-boss will retry
        }
      }
    })

    console.log(`✅ Worker registered for queue: ${queueName}`)
  } catch (err) {
    console.error(`❌ Failed to register worker for ${queueName}:`, err)
  }
}

// 🔹 Schedule or update recurring job
export async function scheduleJob(serviceId: string, cronPattern: string) {
  const bossInstance = getBoss()
  if (!isStarted) await bossInstance.start()

  const queueName = `health-check-${serviceId}`

  try {
    console.log(`[SCHEDULE] Setting up cron job for ${queueName} (${cronPattern})`)
    await bossInstance.publish(queueName, { serviceId }, {
      cron: cronPattern,
      tz: 'UTC',
      singletonKey: queueName, // avoid duplicate schedules
      retentionMinutes: 60 * 24 // keep job logs 24h
    } as any)
    console.log(`✅ Scheduled ${queueName} with cron: ${cronPattern}`)
  } catch (err) {
    console.error(`❌ Failed to schedule ${queueName}:`, err)
  }
}

// 🔹 Unschedule (when service disabled)
export async function unscheduleJob(serviceId: string) {
  const bossInstance = getBoss()
  if (!isStarted) await bossInstance.start()

  const queueName = `health-check-${serviceId}`

  try {
    console.log(`[UNSCHEDULE] Removing cron job for ${queueName}`)
    await bossInstance.unschedule(queueName)
    console.log(`✅ Unschedule successful for ${queueName}`)
  } catch (err: any) {
    if (err.message?.includes('not found')) {
      console.warn(`⚠️ No existing schedule for ${queueName}`)
      return
    }
    console.error(`❌ Failed to unschedule ${queueName}:`, err)
  }
}

// 🔹 Handle runtime updates (when service toggled)
export async function toggleServiceSchedule(serviceId: string, active: boolean, cron?: string) {
  if (active) {
    if (!cron) {
      console.warn(`⚠️ No cron pattern provided for ${serviceId}, skipping enable`)
      return
    }
    await registerWorker(serviceId)
    await scheduleJob(serviceId, cron)
  } else {
    await unscheduleJob(serviceId)
  }
}
