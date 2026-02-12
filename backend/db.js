import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
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
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
  });
}

const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  state: DataTypes.STRING,
  date: DataTypes.STRING,
  endDate: DataTypes.STRING,
  status: DataTypes.STRING,
  worker: DataTypes.STRING,
  workerId: DataTypes.STRING,
  cameras: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  holes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  days: DataTypes.INTEGER,
  field: DataTypes.STRING,
  googleCalendarEventId: DataTypes.STRING,
}, {
  timestamps: true,
});

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  state: DataTypes.STRING,
  status: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  specialty: DataTypes.STRING,
  camerasAssigned: {
    type: DataTypes.JSON,
    defaultValue: []
  },
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
  batteryLevel: DataTypes.INTEGER,
  lastMaintenance: DataTypes.STRING,
  assignedTo: DataTypes.STRING,
  serialNumber: DataTypes.STRING,
  simNumber: DataTypes.STRING,
  notes: DataTypes.STRING,
}, {
  timestamps: true,
});

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  cameras: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  destination: DataTypes.STRING,
  recipient: DataTypes.STRING,
  sender: DataTypes.STRING,
  shipper: DataTypes.STRING, // Nueva persona que envía
  origin: DataTypes.STRING,  // Estado/Lugar de origen
  date: DataTypes.STRING,
  status: DataTypes.STRING,
  trackingNumber: DataTypes.STRING,
  originState: DataTypes.STRING,
  extraItems: DataTypes.STRING, // Items adicionales
}, {
  timestamps: true,
});

const CameraHistory = sequelize.define('CameraHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cameraId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // 'tournament', 'maintenance', 'assignment', 'status_change'
    allowNull: false
  },
  description: DataTypes.STRING,
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  details: {
    type: DataTypes.JSON, // Store additional metadata like tournamentId, workerId, etc.
    defaultValue: {}
  }
}, {
  timestamps: true
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING, // 'admin' or 'user'
    defaultValue: 'user',
  },
  lastLogin: DataTypes.STRING,
  failedAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockoutUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
});

const LoginAttempt = sequelize.define('LoginAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip: DataTypes.STRING,
  username: DataTypes.STRING,
  success: DataTypes.BOOLEAN,
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Sync database
const initDb = async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

export { sequelize, Tournament, Worker, Camera, Shipment, CameraHistory, User, LoginAttempt, initDb };
