const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

exports.handler = async (event, context) => {
  try {
    const db = await open({
      filename: 'my-database.db',
      driver: sqlite3.Database,
    });

    await db.run('CREATE TABLE IF NOT EXISTS map_info (id INTEGER PRIMARY KEY, name TEXT, latitude REAL, longitude REAL)');

    const data = JSON.parse(event.body);

    if (data.action === 'add') {
      const { name, latitude, longitude } = data;

      // Add the map info to the database
      await db.run('INSERT INTO map_info (name, latitude, longitude) VALUES (?, ?, ?)', name, latitude, longitude);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data saved successfully' }),
      };
    } else if (data.action === 'get_all') {
      // Get all map info from the database
      const rows = await db.all('SELECT * FROM map_info');

      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
