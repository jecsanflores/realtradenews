exports.up = function(knex) {
  return knex.schema.createTable('news', function(table) {
    table.increments('id').primary();
    table.string('title', 500).notNullable();
    table.string('source', 255).notNullable();
    table.text('content').notNullable();
    table.string('url', 500);

    // Sentiment analysis: positive, negative, neutral
    table.enum('sentiment', ['positive', 'negative', 'neutral']).defaultTo('neutral');

    // Market impact: low, medium, high, very_high
    table.enum('impact', ['low', 'medium', 'high', 'very_high']).defaultTo('medium');

    // Tags for categorization
    table.json('tags').defaultTo('[]');

    table.timestamp('published_at').notNullable();
    table.timestamps(true, true);

    // Indexes for search and filtering
    table.index('source');
    table.index('sentiment');
    table.index('impact');
    table.index('published_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('news');
};
