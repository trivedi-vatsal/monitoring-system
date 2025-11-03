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

  // Create CLIENT-SERVICES table (using hyphen naming convention)
  await knex.schema.createTable('client-services', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('client_id').references('id').inTable('clients').onDelete('CASCADE')
    table.text('name').notNullable()
    table.string('slug').notNullable().unique()
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

  // Create SERVICE-STATUS table (using hyphen naming convention)
  await knex.schema.createTable('service-status', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('service_id').references('id').inTable('client-services').onDelete('CASCADE')
    table.enum('status', ['up', 'down', 'degraded']).notNullable()
    table.integer('status_code')
    table.integer('latency_ms').notNullable()
    table.text('error_message')
    table.jsonb('metadata').comment('Additional metadata about the health check')
    table.jsonb('response').comment('API response body from the health check')
    table.timestamp('checked_at').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

  // Create UPTIME_STATS table (if it exists in your services)
  await knex.schema.createTable('uptime-stats', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('service_id').references('id').inTable('client-services').onDelete('CASCADE')
    table.date('date').notNullable()
    table.integer('total_checks').defaultTo(0)
    table.integer('successful_checks').defaultTo(0)
    table.integer('failed_checks').defaultTo(0)
    table.decimal('uptime_percentage', 5, 2).defaultTo(0)
    table.integer('avg_latency_ms')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Unique constraint to prevent duplicate stats for same service and date
    table.unique(['service_id', 'date'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('uptime-stats')
  await knex.schema.dropTableIfExists('service-status')
  await knex.schema.dropTableIfExists('client-services')
  await knex.schema.dropTableIfExists('clients')
}