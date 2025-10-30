// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { app } from './src/app'

// Load our database connection info from the app configuration
const connection = app.get('postgresql')

const config = {
  client: 'pg',
  connection,
  migrations: {
    directory: './migrations'
  }
}

module.exports = config
