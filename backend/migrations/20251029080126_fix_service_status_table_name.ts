import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Rename service_status to service-status for consistency
  await knex.schema.renameTable('service_status', 'service-status')
}

export async function down(knex: Knex): Promise<void> {
  // Revert back to service_status
  await knex.schema.renameTable('service-status', 'service_status')
}
