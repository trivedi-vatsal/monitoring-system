import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('service-status', table => {
    table.jsonb('metadata').comment('Additional metadata about the health check')
    table.jsonb('response').comment('API response body from the health check')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('service-status', table => {
    table.dropColumn('metadata')
    table.dropColumn('response')
  })
}
