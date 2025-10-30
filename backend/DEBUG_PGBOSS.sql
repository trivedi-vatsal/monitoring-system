-- ========================================
-- PG-BOSS DIAGNOSTIC QUERIES
-- ========================================

-- 1. Check all cron schedules
SELECT 
  name as queue_name,
  cron,
  timezone,
  data,
  created_on,
  updated_on
FROM pgboss.schedule
ORDER BY created_on DESC;

-- 2. Check pending jobs (waiting to be processed)
SELECT 
  id,
  name as queue_name,
  data,
  state,
  startat,
  createdon,
  startedon
FROM pgboss.job
WHERE state = 'created'
ORDER BY createdon DESC
LIMIT 20;

-- 3. Check active/running jobs
SELECT 
  id,
  name as queue_name,
  data,
  state,
  startedon
FROM pgboss.job
WHERE state = 'active'
ORDER BY startedon DESC;

-- 4. Check completed jobs (last 20)
SELECT 
  id,
  name as queue_name,
  data,
  state,
  createdon,
  completedon,
  completedon - createdon as duration
FROM pgboss.job
WHERE state = 'completed'
ORDER BY completedon DESC
LIMIT 20;

-- 5. Job count by state
SELECT 
  state,
  COUNT(*) as count
FROM pgboss.job
GROUP BY state
ORDER BY count DESC;

-- 6. Verify schedule-to-service mapping
SELECT 
  cs.id as service_id,
  cs.name as service_name,
  cs.active,
  cs.cron_pattern as service_cron,
  s.name as schedule_queue_name,
  s.cron as pgboss_cron,
  s.data,
  CASE 
    WHEN cs.active = true AND s.name IS NOT NULL THEN '✅ SCHEDULED'
    WHEN cs.active = false AND s.name IS NULL THEN '✅ NOT SCHEDULED'
    WHEN cs.active = true AND s.name IS NULL THEN '❌ MISSING SCHEDULE'
    WHEN cs.active = false AND s.name IS NOT NULL THEN '❌ SHOULD BE UNSCHEDULED'
  END as status
FROM client_services cs
LEFT JOIN pgboss.schedule s ON s.name = 'health-check-' || cs.id::text
ORDER BY cs.created_at DESC;

-- 7. Jobs created by each schedule (last hour)
SELECT 
  s.name as schedule_name,
  s.cron,
  COUNT(j.id) as jobs_created,
  MAX(j.createdon) as last_job_created
FROM pgboss.schedule s
LEFT JOIN pgboss.job j ON j.name = s.name AND j.createdon > NOW() - INTERVAL '1 hour'
GROUP BY s.name, s.cron
ORDER BY s.name;

-- 8. Failed jobs (if any)
SELECT 
  id,
  name as queue_name,
  data,
  state,
  output,
  createdon,
  completedon
FROM pgboss.job
WHERE state = 'failed'
ORDER BY completedon DESC
LIMIT 10;
