import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

async function run() {
  const [results] = await sequelize.query('SELECT rowid, * FROM CameraHistories WHERE id IS NULL');
  console.log(`Found ${results.length} rows to fix`);
  
  for (const row of results) {
    const newId = `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await sequelize.query(`UPDATE CameraHistories SET id = '${newId}' WHERE rowid = ${row.rowid}`);
    console.log(`Updated rowid ${row.rowid} with ID ${newId}`);
  }
  
  console.log('Fix completed');
}

run();
