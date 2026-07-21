exports.up = function(knex) {
  return knex.schema.createTable('alerts', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // Alert type: price, news, political, economic
    table.enum('type', ['price', 'news', 'political', 'economic']).notNullable();

    // Target: stock symbol, keyword, speaker name
    table.string('target', 255).notNullable();

    // Condition: what triggers the alert
    table.string('condition', 255).notNullable();

    // Notification method: push, email, both
    table.enum('notification_method', ['push', 'email', 'both']).defaultTo('both');

    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index('user_id');
    table.index('type');
    table.index('active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('alerts');
};
