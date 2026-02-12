import express from 'express';
import cors from 'cors';
import { sequelize, Tournament, Worker, Camera, Shipment, CameraHistory, User, LoginAttempt, initDb } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(helmet());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Initialize Database
initDb();

// Helper to create CRUD routes
const createCrudRoutes = (model, path) => {
  app.get(path, async (req, res) => {
    try {
      const items = await model.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post(path, async (req, res) => {
    try {
      const newItem = await model.create(req.body);
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put(`${path}/:id`, async (req, res) => {
    try {
      const item = await model.findByPk(req.params.id);
      if (item) {
        await item.update(req.body);
        res.json(item);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete(`${path}/:id`, async (req, res) => {
    try {
      const item = await model.findByPk(req.params.id);
      if (item) {
        await item.destroy();
        res.json({ message: 'Item deleted' });
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Create routes for main entities
createCrudRoutes(Tournament, '/tournaments');
createCrudRoutes(Worker, '/workers');
createCrudRoutes(Camera, '/cameras');
createCrudRoutes(Shipment, '/shipments');

// Camera History Routes
app.get('/camera-history', async (req, res) => {
  try {
    const { cameraId } = req.query;
    const where = cameraId ? { cameraId } : {};
    
    const history = await CameraHistory.findAll({
      where,
      order: [['date', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/camera-history', async (req, res) => {
  try {
    const newEntry = await CameraHistory.create(req.body);
    res.json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/camera-history', async (req, res) => {
  try {
    await CameraHistory.destroy({
      where: {}, 
      // truncate: true // Removed to ensure SQLite compatibility
    });
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/camera-history/:id', async (req, res) => {
  try {
    const entry = await CameraHistory.findByPk(req.params.id);
    if (entry) {
      await entry.destroy();
      res.json({ message: 'History entry deleted' });
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  try {
    const user = await User.findOne({ where: { username } });

    // Log attempt
    await LoginAttempt.create({
      ip,
      username,
      success: false // Default to false, update if success
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check lockout
    if (user.lockoutUntil && new Date() < new Date(user.lockoutUntil)) {
      const remaining = Math.ceil((new Date(user.lockoutUntil) - new Date()) / 60000);
      return res.status(429).json({ error: `Account locked. Try again in ${remaining} minutes.` });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset lockout on success
    user.failedAttempts = 0;
    user.lockoutUntil = null;
    user.lastLogin = new Date().toISOString();
    await user.save();

    // Update last login attempt to success
    const lastAttempt = await LoginAttempt.findOne({ 
      where: { username, ip },
      order: [['timestamp', 'DESC']]
    });
    if (lastAttempt) {
      lastAttempt.success = true;
      await lastAttempt.save();
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Protected User Routes
app.get('/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'lastLogin', 'createdAt', 'failedAttempts', 'lockoutUntil']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const { username, password, role } = req.body;
    
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const { username, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login History Route
app.get('/login-history', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  try {
    const history = await LoginAttempt.findAll({
      order: [['timestamp', 'DESC']],
      limit: 100
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {});
