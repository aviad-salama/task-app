import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { initDb } from './services/task.service.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); //used in order to prevent a web blocking.

app.use(express.json());// Middleware to parse JSON payloads

// Initialize Database Tables on server startup
(async () => {
  try {
    await initDb();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
})();

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Task Tracker API is Running', status: 'Healthy' });
});

// Mount all API routes under /api prefix (/api/auth, /api/tasks)
app.use('/api', apiRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});