import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Add slug column to client-services table
  await knex.schema.alterTable('client-services', (table) => {
    table.string('slug').nullable()
  })

  // Generate slugs for existing services based on name
  const services = await knex('client-services').select('id', 'name')
  
  // Track used slugs to handle duplicates
  const usedSlugs = new Set<string>()
  
  for (const service of services) {
    let slug = service.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Handle duplicates by appending a number
    let counter = 1
    let uniqueSlug = slug
    while (usedSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    
    usedSlugs.add(uniqueSlug)
    
    await knex('client-services')
      .where('id', service.id)
      .update({ slug: uniqueSlug })
  }

  // Make slug non-nullable and unique after populating
  await knex.schema.alterTable('client-services', (table) => {
    table.string('slug').notNullable().unique().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('client-services', (table) => {
    table.dropColumn('slug')
  })
}
