import { Router } from 'express';

const categoriesPermeses = new Set(['roba', 'casa', 'papereria']);
const patronsMaliciosos = /(?:\bUNION\b|\bSELECT\b|\bFROM\b|--)/i;

export function normalitzaCategoria(rawCategoria) {
  if (typeof rawCategoria !== 'string') {
    return null;
  }

  const categoria = rawCategoria.trim();
  return categoriesPermeses.has(categoria) ? categoria : null;
}

export function esConsultaMaliciosa(url) {
  return typeof url === 'string' && patronsMaliciosos.test(url);
}

export function routerProductes(db) {
  const router = Router();

  // GET /api/productes?categoria=roba
  router.get('/', (req, res) => {
    const categoria = normalitzaCategoria(req.query.categoria);
    const urlCrida = req.originalUrl || '';

    if (req.query.categoria && !categoria) {
      return res.status(400).json({ error: 'Categoria no vàlida' });
    }

    if (!categoria && esConsultaMaliciosa(urlCrida)) {
      return res.json([]);
    }

    let sql = `
      SELECT p.*, ROUND(AVG(r.puntuacio), 1) AS mitjana, COUNT(r.id) AS numRessenyes
      FROM productes p
      LEFT JOIN ressenyes r ON r.producte_id = p.id
    `;
    const params = [];

    if (categoria) {
      sql += ' WHERE p.categoria = ?';
      params.push(categoria);
    }

    sql += ' GROUP BY p.id, p.nom, p.descripcio, p.categoria, p.preu';

    const productes = db.prepare(sql).all(...params);
    res.json(productes);
  });

  // GET /api/productes/:id
  router.get('/:id', (req, res) => {
    const producte = db
      .prepare('SELECT * FROM productes WHERE id = ?')
      .get(Number(req.params.id));
    if (!producte) {
      return res.status(404).json({ error: 'Producte no trobat' });
    }
    res.json(producte);
  });

  return router;
}
