import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Drop the unused monitoring_runs table
  await knex.schema.dropTableIfExists('monitoring_runs')
}

export async function down(knex: Knex): Promise<void> {
  // Recreate the table if needed for rollback
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
