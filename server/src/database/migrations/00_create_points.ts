import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('points', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('name');
    table.string('email');
    table.string('whatsapp');
    table.decimal('latitude');
    table.decimal('longitude');
    table.string('city');
    table.string('uf', 2);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('points');
}