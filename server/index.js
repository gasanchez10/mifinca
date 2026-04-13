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
  ssl: DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
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
    const body = req.body;
    // Accept both Spanish and English field names from frontend
    const name = body.name || body.nombre || body.nombreCompleto;
    const whatsapp = body.whatsapp;
    const department = body.department || body.ubicacion;
    const profile = body.profile || body.perfil;
    const interest = body.interest || body.interes;
    const plan = body.plan;
    const wants_call = body.wants_call || body.llamada;
    const source = body.source || 'hero';

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

// Admin dashboard - serves inline HTML with leads table
app.get('/admin', async (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MI FINCA - Admin Panel</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .header { background: linear-gradient(135deg, #2D5A3D, #1A3D3D); color: white; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 1.5rem; }
    .header a { color: #D4A843; text-decoration: none; font-weight: 600; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .stat-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: center; }
    .stat-card .number { font-size: 2.5rem; font-weight: 900; color: #2D5A3D; }
    .stat-card .label { color: #777; font-size: 0.9rem; margin-top: 0.25rem; }
    .table-container { padding: 0 2rem 2rem; max-width: 1400px; margin: 0 auto; }
    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .table-header h2 { color: #2D5A3D; }
    .btn-export { background: #D4A843; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
    .btn-export:hover { background: #E8A030; }
    .btn-refresh { background: #2D5A3D; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; margin-right: 0.5rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    th { background: #2D5A3D; color: white; padding: 1rem; text-align: left; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 0.875rem 1rem; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    tr:hover td { background: #f9f9f9; }
    .badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .badge-hero { background: #e8f5e9; color: #2D5A3D; }
    .badge-full { background: #fff3e0; color: #E8A030; }
    .empty { text-align: center; padding: 3rem; color: #999; }
    @media (max-width: 768px) {
      .table-container { padding: 0 1rem 1rem; overflow-x: auto; }
      table { font-size: 0.8rem; min-width: 800px; }
      th, td { padding: 0.6rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>MI FINCA - Panel de Leads</h1>
    <a href="/">Volver a la landing</a>
  </div>
  <div class="stats-grid" id="stats"></div>
  <div class="table-container">
    <div class="table-header">
      <h2>Leads registrados</h2>
      <div>
        <button class="btn-refresh" onclick="loadData()">Actualizar</button>
        <button class="btn-export" onclick="exportCSV()">Exportar CSV</button>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>WhatsApp</th>
          <th>Ubicaci\u00f3n</th>
          <th>Perfil</th>
          <th>Inter\u00e9s</th>
          <th>Plan</th>
          <th>Llamada</th>
          <th>Fuente</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody id="leads-body">
        <tr><td colspan="10" class="empty">Cargando...</td></tr>
      </tbody>
    </table>
  </div>
  <script>
    let leadsData = [];
    async function loadData() {
      try {
        const [leadsRes, statsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/stats')
        ]);
        leadsData = await leadsRes.json();
        const stats = await statsRes.json();

        document.getElementById('stats').innerHTML =
          '<div class="stat-card"><div class="number">' + stats.total + '</div><div class="label">Total Leads</div></div>' +
          '<div class="stat-card"><div class="number">' + (stats.bySource.hero_form || 0) + '</div><div class="label">Desde Hero</div></div>' +
          '<div class="stat-card"><div class="number">' + (stats.bySource.full_form || 0) + '</div><div class="label">Formulario Completo</div></div>' +
          '<div class="stat-card"><div class="number">' + (stats.byPlan.Premium || 0) + '</div><div class="label">Interesados Premium</div></div>';

        const tbody = document.getElementById('leads-body');
        if (leadsData.length === 0) {
          tbody.innerHTML = '<tr><td colspan="10" class="empty">No hay leads registrados a\u00fan</td></tr>';
          return;
        }
        tbody.innerHTML = leadsData.map((lead, i) =>
          '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td><strong>' + (lead.name || '-') + '</strong></td>' +
          '<td>' + (lead.whatsapp || '-') + '</td>' +
          '<td>' + (lead.department || '-') + '</td>' +
          '<td>' + (lead.profile || '-') + '</td>' +
          '<td>' + (lead.interest || '-') + '</td>' +
          '<td>' + (lead.plan || '-') + '</td>' +
          '<td>' + (lead.wants_call || '-') + '</td>' +
          '<td><span class="badge ' + (lead.source === 'hero_form' ? 'badge-hero' : 'badge-full') + '">' + (lead.source || '-') + '</span></td>' +
          '<td>' + new Date(lead.created_at).toLocaleDateString('es-CO', {day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) + '</td>' +
          '</tr>'
        ).join('');
      } catch (e) { console.error('Error loading data:', e); }
    }
    function exportCSV() {
      if (!leadsData.length) return alert('No hay datos para exportar');
      const headers = ['Nombre','WhatsApp','Ubicacion','Perfil','Interes','Plan','Llamada','Fuente','Fecha'];
      const rows = leadsData.map(l => [l.name,l.whatsapp,l.department,l.profile,l.interest,l.plan,l.wants_call,l.source,l.created_at].map(v => '"' + (v||'') + '"').join(','));
      const csv = [headers.join(','), ...rows].join('\\n');
      const blob = new Blob([csv], {type:'text/csv'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mifinca_leads_' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
    }
    loadData();
  </script>
</body>
</html>`);
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
