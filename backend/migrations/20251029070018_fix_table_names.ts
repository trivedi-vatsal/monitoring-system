import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Rename client_services to client-services to match service configuration
  await knex.schema.renameTable('client_services', 'client-services')
}

export async function down(knex: Knex): Promise<void> {
  // Rename back to client_services
  await knex.schema.renameTable('client-services', 'client_services')
}
