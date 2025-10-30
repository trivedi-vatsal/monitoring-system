import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Enable UUID generation
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  // Create CLIENTS table
  await knex.schema.createTable('clients', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.text('name').notNullable()
    table.text('slug').notNullable().unique()
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Create CLIENT_SERVICES table
  await knex.schema.createTable('client-services', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('client_id').references('id').inTable('clients').onDelete('CASCADE')
    table.text('name').notNullable()
    table.text('endpoint_url').notNullable()
    table.text('basic_auth_username_encrypted')
    table.text('basic_auth_password_encrypted')
    table.string('cron_pattern').notNullable().defaultTo('*/5 * * * *') // Default to every 5 minutes
    table.integer('expected_status_code').defaultTo(200)
    table.integer('timeout_ms').defaultTo(10000)
    table.boolean('active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Create SERVICE_STATUS table
  await knex.schema.createTable('service_status', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('service_id').references('id').inTable('client-services').onDelete('CASCADE')
    table.enum('status', ['up', 'down', 'degraded']).notNullable()
    table.integer('status_code')
    table.integer('latency_ms').notNullable()
    table.text('error_message')
    table.timestamp('checked_at').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Create MONITORING_RUNS table
  await knex.schema.createTable('monitoring_runs', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamp('started_at').notNullable()
    table.timestamp('completed_at')
    table.integer('services_checked').defaultTo(0)
    table.integer('services_up').defaultTo(0)
    table.integer('services_down').defaultTo(0)
    table.integer('services_degraded').defaultTo(0)
    table.integer('total_duration_ms')
    table.jsonb('errors')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('monitoring_runs')
  await knex.schema.dropTableIfExists('service_status')
  await knex.schema.dropTableIfExists('client_services')
  await knex.schema.dropTableIfExists('clients')
}
