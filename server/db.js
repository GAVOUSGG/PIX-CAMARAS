import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

// Define Models

const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  state: DataTypes.STRING,
  date: DataTypes.STRING, // Keeping as string to match JSON, could be DATEONLY
  endDate: DataTypes.STRING,
  status: DataTypes.STRING,
  worker: DataTypes.STRING, // Name of worker
  workerId: DataTypes.STRING,
  cameras: {
    type: DataTypes.JSON, // Storing array of camera IDs
    defaultValue: [],
  },
  holes: {
    type: DataTypes.JSON, // Storing array of hole numbers
    defaultValue: [],
  },
  days: DataTypes.INTEGER,
  field: DataTypes.STRING,
  cameraStatus: DataTypes.STRING,
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  state: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  status: DataTypes.STRING,
  specialty: DataTypes.STRING,
  camerasAssigned: {
    type: DataTypes.JSON, // Array of camera IDs
    defaultValue: [],
  },
  photo: DataTypes.STRING,
}, {
  timestamps: true,
});

const Camera = sequelize.define('Camera', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  model: DataTypes.STRING,
  type: DataTypes.STRING,
  status: DataTypes.STRING,
  location: DataTypes.STRING,
  serialNumber: DataTypes.STRING,
  simNumber: DataTypes.STRING,
  assignedTo: DataTypes.STRING, // Name of worker
  notes: DataTypes.TEXT,
}, {
  timestamps: true,
});

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  cameras: {
    type: DataTypes.JSON, // Array of camera IDs
    defaultValue: [],
  },
  destination: DataTypes.STRING,
  recipient: DataTypes.STRING,
  sender: DataTypes.STRING,
  shipper: DataTypes.STRING,
  date: DataTypes.STRING,
  status: DataTypes.STRING,
  trackingNumber: DataTypes.STRING,
  extraItems: DataTypes.STRING,
  origin: DataTypes.STRING, // New field for origin location
  originState: DataTypes.STRING, // Explicit state of origin
}, {
  timestamps: true,
});

const CameraHistory = sequelize.define('CameraHistory', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  cameraId: DataTypes.STRING,
  type: DataTypes.STRING,
  title: DataTypes.STRING,
  details: {
    type: DataTypes.JSON, // Object with details
    defaultValue: {},
  },
  date: DataTypes.STRING,
}, {
  timestamps: true,
});

// Sync database
const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true }); // Create tables if they don't exist, alter if they do
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, Tournament, Worker, Camera, Shipment, CameraHistory, initDb };
