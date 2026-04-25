const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { getPhotoRef, proxyPhoto } = require("../services/googlePlaces");

const VALID_TYPES = ["cave", "restaurant", "bar"];
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;

router.get("/", async (req, res) => {
  try {
    const { ville, type } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const offset = parseInt(req.query.offset) || 0;

    let where = "WHERE 1=1";
    const params = [];
    if (ville) {
      params.push(ville);
      where += ` AND ville ILIKE $${params.length}`;
    }
    if (type) {
      params.push(type);
      where += ` AND type = $${params.length}`;
    }

    const dataParams = [...params, limit, offset];
    const [result, countResult] = await Promise.all([
      pool.query(
        `SELECT id, nom, type, adresse, ville, latitude, longitude, description, created_at FROM adresses ${where} ORDER BY nom LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
        dataParams,
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM adresses ${where}`, params),
    ]);

    res.json({ data: result.rows, total: countResult.rows[0].total, limit, offset });
  } catch {
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

router.get("/proximite", async (req, res) => {
  try {
    const { lat, lng, rayon = 5000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ erreur: "lat et lng requis" });

    const result = await pool.query(
      `SELECT id, nom, type, adresse, ville, latitude, longitude, description,
        ST_Distance(geom, ST_SetSRID(ST_MakePoint($2::float, $1::float), 4326)) * 111320 AS distance
       FROM adresses
       WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($2::float, $1::float), 4326), $3::float / 111320)
       ORDER BY distance`,
      [lat, lng, rayon],
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nom, type, adresse, ville, latitude, longitude, description FROM adresses WHERE id = $1",
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ erreur: "non trouvée" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

// Retourne une URL proxifiée (clé Google jamais exposée au client)
router.get("/:id/photo", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT nom, adresse, ville FROM adresses WHERE id = $1", [
      id,
    ]);
    if (!rows.length) return res.status(404).json({ erreur: "non trouvée" });

    const photoRef = await getPhotoRef(id, rows[0].nom, rows[0].adresse, rows[0].ville);
    if (!photoRef) return res.json({ photo: null });

    const base = process.env.API_BASE_URL || "http://localhost:3000";
    res.json({ photo: `${base}/adresses/${id}/photo/media` });
  } catch {
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

router.get("/:id/photo/media", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT nom, adresse, ville FROM adresses WHERE id = $1", [
      id,
    ]);
    if (!rows.length) return res.status(404).send("Not found");

    const photoRef = await getPhotoRef(id, rows[0].nom, rows[0].adresse, rows[0].ville);
    if (!photoRef) return res.status(404).send("No photo");

    await proxyPhoto(photoRef, res);
  } catch {
    res.status(500).send("Erreur serveur");
  }
});

router.post("/", async (req, res) => {
  try {
    const { nom, type, adresse, ville, latitude, longitude, description } = req.body;
    if (!nom || !type || !ville || !latitude || !longitude) {
      return res.status(400).json({ erreur: "nom, type, ville, latitude, longitude sont requis" });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ erreur: `type doit être : ${VALID_TYPES.join(", ")}` });
    }

    const result = await pool.query(
      `INSERT INTO adresses (nom, type, adresse, ville, latitude, longitude, description, geom)
       VALUES ($1, $2, $3, $4, $5::decimal, $6::decimal, $7, ST_SetSRID(ST_MakePoint($6::numeric, $5::numeric), 4326))
       RETURNING id, nom, type, adresse, ville, latitude, longitude, description`,
      [nom, type, adresse, ville, latitude, longitude, description],
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

module.exports = router;
