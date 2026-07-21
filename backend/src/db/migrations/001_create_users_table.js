exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('name', 255).notNullable();
    table.enum('plan', ['free', 'pro', 'enterprise']).defaultTo('free');
    table.string('phone', 20);
    table.boolean('email_verified').defaultTo(false);
    table.timestamps(true, true);

    // Indexes for performance
    table.index('email');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
