import express from 'express';
import cors from 'cors';
import { sequelize, initDb, Tournament, Worker, Camera, Shipment, CameraHistory } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Generic CRUD handlers
const createCrudRoutes = (router, Model, pathName) => {
  // GET all with filtering
  router.get(`/${pathName}`, async (req, res) => {
    try {
      const where = {};
      // Support simple filtering like json-server (e.g. ?cameraId=123)
      // Ignore special params starting with _ (like _sort, _limit, etc.)
      for (const key in req.query) {
        if (!key.startsWith('_')) {
          where[key] = req.query[key];
        }
      }
      console.log(`🔍 [API] GET /${pathName} filters:`, where);
      const items = await Model.findAll({ where });
      res.json(items);
    } catch (error) {
      console.error(`Error fetching ${pathName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET one
  router.get(`/${pathName}/:id`, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      console.error(`Error fetching ${pathName}/${req.params.id}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST
  router.post(`/${pathName}`, async (req, res) => {
    try {
      const newItem = await Model.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error(`Error creating ${pathName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT
  router.put(`/${pathName}/:id`, async (req, res) => {
    try {
      const [updated] = await Model.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedItem = await Model.findByPk(req.params.id);
        res.json(updatedItem);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      console.error(`Error updating ${pathName}/${req.params.id}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE
  router.delete(`/${pathName}/:id`, async (req, res) => {
    try {
      const deleted = await Model.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      console.error(`Error deleting ${pathName}/${req.params.id}:`, error);
      res.status(500).json({ error: error.message });
    }
  });
};

// Register routes
createCrudRoutes(app, Tournament, 'tournaments');
createCrudRoutes(app, Worker, 'workers');
createCrudRoutes(app, Camera, 'cameras');
createCrudRoutes(app, Shipment, 'shipments');
createCrudRoutes(app, CameraHistory, 'cameraHistory');



// Start server
const startServer = async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
};

startServer();
