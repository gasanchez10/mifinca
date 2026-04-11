import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { addSubscriber } from './mailerlite.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

app.use(cors());
app.use(express.json());

async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50) NOT NULL,
        department VARCHAR(255),
        profile VARCHAR(100),
        interest VARCHAR(100),
        plan VARCHAR(50),
        wants_call VARCHAR(50),
        source VARCHAR(50) DEFAULT 'hero',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    client.release();
    console.log('[Database] Tables initialized successfully');
  } catch (error) {
    console.error('[Database] Error initializing tables:', error);
    throw error;
  }
}

app.use(express.static(path.join(__dirname, '../dist')));

app.post('/api/leads', async (req, res) => {
  try {
    const { name, whatsapp, department, profile, interest, plan, wants_call, source = 'hero' } =
      req.body;

    if (!name || !whatsapp) {
      return res.status(400).json({ error: 'Name and WhatsApp are required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO leads (id, name, whatsapp, department, profile, interest, plan, wants_call, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [id, name, whatsapp, department, profile, interest, plan, wants_call, source]
    );

    console.log(`[Leads] New lead saved: ${name} (${whatsapp})`);

    addSubscriber(whatsapp, name, { company: department });

    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('[API] Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('[API] Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [total, bySource, byProfile, byPlan] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM leads'),
      pool.query('SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC'),
      pool.query(
        'SELECT profile, COUNT(*) as count FROM leads WHERE profile IS NOT NULL GROUP BY profile ORDER BY count DESC'
      ),
      pool.query(
        'SELECT plan, COUNT(*) as count FROM leads WHERE plan IS NOT NULL GROUP BY plan ORDER BY count DESC'
      ),
    ]);

    res.json({
      total: parseInt(total.rows[0].count, 10),
      bySource: bySource.rows.reduce((acc, row) => ({ ...acc, [row.source]: row.count }), {}),
      byProfile: byProfile.rows.reduce((acc, row) => ({ ...acc, [row.profile]: row.count }), {}),
      byPlan: byPlan.rows.reduce((acc, row) => ({ ...acc, [row.plan]: row.count }), {}),
    });
  } catch (error) {
    console.error('[API] Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] MI FINCA backend running on port ${PORT}`);
      console.log(`[Server] Database URL: ${DATABASE_URL ? 'configured' : 'not set'}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

start();
