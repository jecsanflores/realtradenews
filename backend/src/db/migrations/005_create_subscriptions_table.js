exports.up = function(knex) {
  return knex.schema.createTable('subscriptions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    // Stripe identifiers
    table.string('stripe_customer_id', 255);
    table.string('stripe_subscription_id', 255).unique();

    // Plan and status
    table.enum('plan', ['free', 'pro', 'enterprise']).defaultTo('free');
    table.enum('status', ['active', 'canceled', 'past_due', 'unpaid']).defaultTo('active');

    // Billing dates
    table.datetime('current_period_start');
    table.datetime('current_period_end');
    table.datetime('cancel_at');

    // Metadata
    table.decimal('amount', 10, 2);
    table.string('currency', 3).defaultTo('USD');

    table.timestamps(true, true);

    // Indexes
    table.index('user_id');
    table.index('stripe_subscription_id');
    table.index('status');
    table.index('current_period_end');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('subscriptions');
};
