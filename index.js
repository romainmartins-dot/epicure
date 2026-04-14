const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({ database: 'raisin_db' });

app.get('/', (req, res) => {
  res.send('Bienvenue sur projet-app-vins ! 🍷');
});

app.get('/adresses', async (req, res) => {
  const { ville, type } = req.query;
  let query = 'SELECT id, nom, type, adresse, ville, latitude, longitude, description, created_at FROM adresses WHERE 1=1';
  const params = [];
  if (ville) { params.push(ville); query += ` AND ville ILIKE $${params.length}`; }
  if (type) { params.push(type); query += ` AND type = $${params.length}`; }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

app.get('/adresses/proximite', async (req, res) => {
  const { lat, lng, rayon = 5000 } = req.query;
  if (!lat || !lng) return res.status(400).json({ erreur: 'lat et lng sont requis' });
  const query = `
    SELECT id, nom, type, adresse, ville, latitude, longitude, description,
      ST_Distance(geom, ST_SetSRID(ST_MakePoint($2::float, $1::float), 4326)) * 111320 AS distance
    FROM adresses
    WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($2::float, $1::float), 4326), $3::float / 111320)
    ORDER BY distance
  `;
  const result = await pool.query(query, [lat, lng, rayon]);
  res.json(result.rows);
});

app.post('/adresses', async (req, res) => {
  const { nom, type, adresse, ville, latitude, longitude, description } = req.body;
  if (!nom || !type || !ville || !latitude || !longitude) {
    return res.status(400).json({ erreur: 'nom, type, ville, latitude, longitude sont requis' });
  }
  const result = await pool.query(
    `INSERT INTO adresses (nom, type, adresse, ville, latitude, longitude, description, geom)
     VALUES ($1, $2, $3, $4, $5::float, $6::float, $7, ST_SetSRID(ST_MakePoint($6::float, $5::float), 4326))
     RETURNING id, nom, type, adresse, ville, latitude, longitude, description`,
    [nom, type, adresse, ville, latitude, longitude, description]
  );
  res.status(201).json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});