import { sequelize, Tournament } from './server/db.js';

const checkTournaments = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const tournaments = await Tournament.findAll();
    console.log(`Found ${tournaments.length} tournaments.`);
    
    tournaments.forEach(t => {
      console.log(`ID: ${t.id} | Name: ${t.name} | Status: ${t.status}`);
    });

    const badTournaments = tournaments.filter(t => !t.id || t.id === 'null');
    if (badTournaments.length > 0) {
        console.log(`\nFound ${badTournaments.length} tournaments with invalid IDs. Deleting them...`);
        for (const t of badTournaments) {
            // We can't use t.destroy() if the ID is null and it relies on it? 
            // Actually sequelize instance destroy should work if it has a reference, 
            // but let's try direct destroy with where clause if needed.
            // But t.destroy() is safest first attempt.
            try {
                await t.destroy();
                console.log(`Deleted tournament with name: ${t.name}`);
            } catch (e) {
                console.error(`Failed to delete tournament ${t.name}:`, e.message);
                // Fallback: delete where name matches if id is null
                if (!t.id) {
                    await Tournament.destroy({ where: { name: t.name, date: t.date } });
                    console.log(`Deleted tournament by name/date: ${t.name}`);
                }
            }
        }
    } else {
        console.log("\nNo tournaments with invalid IDs found.");
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

checkTournaments();
