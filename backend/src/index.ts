import { app } from './app'
import { logger } from './logger'

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', reason => logger.error('Unhandled Rejection %O', reason))

// Run migrations before starting the server
async function runMigrations() {
  try {
    const db = app.get('postgresqlClient')

    logger.info('Running database migrations...')
    await db.migrate.latest()
    logger.info('Database migrations completed successfully')
    return true
  } catch (error) {
    logger.error('Error running migrations:', error)
    logger.warn('Application will continue running without migrations. Database operations may fail.')
    return false
  }
}

// Start the application
async function startApp() {
  const migrationSuccess = await runMigrations()

  if (!migrationSuccess) {
    logger.warn('Starting application despite migration failure. Some features may not work properly.')
  }

  app.listen(port).then(() => {
    logger.info(`Feathers app listening on http://${host}:${port}`)
  })
}

startApp().catch(error => {
  logger.error('Failed to start application:', error)
  process.exit(1)
})
