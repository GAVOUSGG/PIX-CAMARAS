import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a SQLite (local)
const sqliteDb = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Conexión a PostgreSQL (Railway)
// Pega aquí tu DATABASE_URL de Railway
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:MHPmLZJLEFPCoQXTKSxYpcDqfIOQkybL@nozomi.proxy.rlwy.net:50012/railway';

const postgresDb = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Definir modelos para SQLite
const defineSqliteModels = (sequelize) => {
  const Tournament = sequelize.define('Tournament', {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    location: Sequelize.STRING,
    state: Sequelize.STRING,
    date: Sequelize.STRING,
    endDate: Sequelize.STRING,
    status: Sequelize.STRING,
    worker: Sequelize.STRING,
    workerId: Sequelize.STRING,
    cameras: { type: Sequelize.JSON, defaultValue: [] },
    holes: { type: Sequelize.JSON, defaultValue: [] },
    days: Sequelize.INTEGER,
    field: Sequelize.STRING,
    googleCalendarEventId: Sequelize.STRING,
  }, { timestamps: true });

  const Worker = sequelize.define('Worker', {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    state: Sequelize.STRING,
    status: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    specialty: Sequelize.STRING,
    camerasAssigned: { type: Sequelize.JSON, defaultValue: [] },
  }, { timestamps: true });

  const Camera = sequelize.define('Camera', {
    id: { type: Sequelize.STRING, primaryKey: true },
    model: Sequelize.STRING,
    type: Sequelize.STRING,
    status: Sequelize.STRING,
    location: Sequelize.STRING,
    batteryLevel: Sequelize.INTEGER,
    lastMaintenance: Sequelize.STRING,
    assignedTo: Sequelize.STRING,
    serialNumber: Sequelize.STRING,
    simNumber: Sequelize.STRING,
    notes: Sequelize.STRING,
  }, { timestamps: true });

  const Shipment = sequelize.define('Shipment', {
    id: { type: Sequelize.STRING, primaryKey: true },
    cameras: { type: Sequelize.JSON, defaultValue: [] },
    destination: Sequelize.STRING,
    recipient: Sequelize.STRING,
    sender: Sequelize.STRING,
    date: Sequelize.STRING,
    status: Sequelize.STRING,
    trackingNumber: Sequelize.STRING,
    originState: Sequelize.STRING,
  }, { timestamps: true });

  const CameraHistory = sequelize.define('CameraHistory', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    cameraId: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.STRING, allowNull: false },
    description: Sequelize.STRING,
    date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    details: { type: Sequelize.JSON, defaultValue: {} }
  }, { timestamps: true });

  const User = sequelize.define('User', {
    id: { type: Sequelize.STRING, primaryKey: true },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    role: { type: Sequelize.STRING, defaultValue: 'user' },
    lastLogin: Sequelize.STRING,
    failedAttempts: { type: Sequelize.INTEGER, defaultValue: 0 },
    lockoutUntil: { type: Sequelize.DATE, allowNull: true }
  }, { timestamps: true });

  const LoginAttempt = sequelize.define('LoginAttempt', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    ip: Sequelize.STRING,
    username: Sequelize.STRING,
    success: Sequelize.BOOLEAN,
    timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
  });

  return { Tournament, Worker, Camera, Shipment, CameraHistory, User, LoginAttempt };
};

async function migrateData() {
  try {
    console.log('Conectando a SQLite...');
    await sqliteDb.authenticate();
    
    console.log('Conectando a PostgreSQL...');
    await postgresDb.authenticate();
    
    console.log('Conexiones establecidas\n');

    // Definir modelos
    const sqliteModels = defineSqliteModels(sqliteDb);
    const postgresModels = defineSqliteModels(postgresDb);

    // Sincronizar PostgreSQL (crear tablas)
    console.log('Creando tablas en PostgreSQL...');
    await postgresDb.sync({ force: true }); // CUIDADO: esto borra datos existentes
    console.log('Tablas creadas\n');

    // Migrar cada tabla
    const tables = ['Tournament', 'Worker', 'Camera', 'Shipment', 'CameraHistory', 'User', 'LoginAttempt'];
    
    for (const tableName of tables) {
      console.log(`Migrando ${tableName}...`);
      const sourceData = await sqliteModels[tableName].findAll({ raw: true });
      
      if (sourceData.length > 0) {
        await postgresModels[tableName].bulkCreate(sourceData);
        console.log(`${tableName}: ${sourceData.length} registros migrados`);
      } else {
        console.log(`${tableName}: Sin datos para migrar`);
      }
    }

    console.log('\nMigración completada exitosamente!');
    
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await sqliteDb.close();
    await postgresDb.close();
  }
}

migrateData();
