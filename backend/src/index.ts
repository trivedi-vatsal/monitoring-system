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
  } catch (error) {
    logger.error('Error running migrations:', error)
    process.exit(1)
  }
}

// Start the application
async function startApp() {
  await runMigrations()
  
  app.listen(port).then(() => {
    logger.info(`Feathers app listening on http://${host}:${port}`)
  })
}

startApp().catch(error => {
  logger.error('Failed to start application:', error)
  process.exit(1)
})
