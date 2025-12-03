import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, Tournament, Worker, Camera, Shipment, CameraHistory } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedData = async () => {
  try {
    // Read db.json
    const dbJsonPath = path.join(__dirname, '../db.json');
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

    // Sync database (force: true drops existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synced. Tables created.');

    // Seed Tournaments
    if (dbData.tournaments && dbData.tournaments.length > 0) {
      await Tournament.bulkCreate(dbData.tournaments);
      console.log(`Seeded ${dbData.tournaments.length} tournaments.`);
    }

    // Seed Workers
    if (dbData.workers && dbData.workers.length > 0) {
      await Worker.bulkCreate(dbData.workers);
      console.log(`Seeded ${dbData.workers.length} workers.`);
    }

    // Seed Cameras
    if (dbData.cameras && dbData.cameras.length > 0) {
      await Camera.bulkCreate(dbData.cameras);
      console.log(`Seeded ${dbData.cameras.length} cameras.`);
    }

    // Seed Shipments
    if (dbData.shipments && dbData.shipments.length > 0) {
      await Shipment.bulkCreate(dbData.shipments);
      console.log(`Seeded ${dbData.shipments.length} shipments.`);
    }

    // Seed CameraHistory
    if (dbData.cameraHistory && dbData.cameraHistory.length > 0) {
      await CameraHistory.bulkCreate(dbData.cameraHistory);
      console.log(`Seeded ${dbData.cameraHistory.length} camera history entries.`);
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedData();
