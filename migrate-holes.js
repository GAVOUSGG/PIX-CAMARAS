import { sequelize, Tournament } from './server/db.js';

const migrateHoles = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const tournaments = await Tournament.findAll();
    console.log(`Found ${tournaments.length} tournaments to check.`);
    
    for (const t of tournaments) {
      let currentHoles = t.holes;
      let newHoles = 0;

      // Check if it's a string (JSON) or already a number
      if (typeof currentHoles === 'string') {
        try {
          const parsed = JSON.parse(currentHoles);
          if (Array.isArray(parsed)) {
            newHoles = parsed.length;
          } else {
            newHoles = Number(parsed) || 0;
          }
        } catch (e) {
            // Maybe it's just a number string
            newHoles = Number(currentHoles) || 0;
        }
      } else if (Array.isArray(currentHoles)) {
        newHoles = currentHoles.length;
      } else if (typeof currentHoles === 'number') {
        newHoles = currentHoles;
      }

      if (currentHoles !== newHoles) {
        console.log(`Migrating tournament ${t.name} (ID: ${t.id}): ${JSON.stringify(currentHoles)} -> ${newHoles}`);
        // We need to update it. Since we haven't altered the table schema in the DB file yet (Sequelize sync alter might not have run or we want to be safe),
        // we are just updating the value.
        // Note: If the column type is still TEXT/JSON in SQLite, storing a number is fine.
        t.holes = newHoles;
        await t.save();
      }
    }

    console.log('Migration completed.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

migrateHoles();
