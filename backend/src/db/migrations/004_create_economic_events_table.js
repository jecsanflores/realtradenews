exports.up = function(knex) {
  return knex.schema.createTable('economic_events', function(table) {
    table.increments('id').primary();
    table.string('country', 100).notNullable();
    table.string('event_name', 255).notNullable();
    table.datetime('event_date').notNullable();

    // Event importance
    table.enum('importance', ['low', 'medium', 'high', 'very_high']).defaultTo('medium');

    // Forecast vs actual results
    table.string('forecast', 255);
    table.string('previous', 255);
    table.string('actual', 255);
    table.string('unit', 100);

    // Political/Fed events
    table.string('speaker', 255);
    table.string('event_type', 100); // speech, decision, announcement
    table.string('location', 255);
    table.text('description');
    table.string('transcript_url', 500);

    // Status: upcoming, in_progress, completed
    table.enum('status', ['upcoming', 'in_progress', 'completed']).defaultTo('upcoming');

    table.timestamps(true, true);

    // Indexes
    table.index('event_date');
    table.index('country');
    table.index('importance');
    table.index('status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('economic_events');
};
