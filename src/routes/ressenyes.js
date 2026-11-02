import { Router } from 'express';

export function routerRessenyes(db) {
  const router = Router();

  // GET /api/ressenyes?producteId=1
  router.get('/', (req, res) => {
    const ressenyes = db
      .prepare('SELECT * FROM ressenyes WHERE producte_id = ? ORDER BY id DESC')
      .all(Number(req.query.producteId));
    res.json(ressenyes);
  });

  // POST /api/ressenyes
  router.post('/', (req, res) => {
    const { producteId, autor, text, puntuacio } = req.body;
    const producteIdNumeric = Number(producteId);

    if (!Number.isInteger(producteIdNumeric) || producteIdNumeric <= 0) {
      return res.status(400).json({ error: 'El camp producteId és obligatori i ha de ser un enter positiu.' });
    }

    const producteExisteix = db
      .prepare('SELECT id FROM productes WHERE id = ?')
      .get(producteIdNumeric);

    if (!producteExisteix) {
      return res.status(400).json({ error: 'El producteId no existeix.' });
    }

    const autorNormalitzat = typeof autor === 'string' ? autor.trim() : '';
    if (!autorNormalitzat) {
      return res.status(400).json({ error: 'L’autor és obligatori.' });
    }

    if (autorNormalitzat.length > 100) {
      return res.status(400).json({ error: 'L’autor no pot superar 100 caràcters.' });
    }

    const textNormalitzat = typeof text === 'string' ? text.trim() : '';
    if (!textNormalitzat) {
      return res.status(400).json({ error: 'El text de la ressenya és obligatori.' });
    }

    if (textNormalitzat.length > 500) {
      return res.status(400).json({ error: 'El text de la ressenya no pot superar 500 caràcters.' });
    }

    const puntuacioNumeric = Number(puntuacio);
    if (!Number.isInteger(puntuacioNumeric) || puntuacioNumeric < 1 || puntuacioNumeric > 5) {
      return res.status(400).json({ error: 'La puntuació ha d’estar entre 1 i 5.' });
    }

    try {
      const resultat = db
        .prepare(
          'INSERT INTO ressenyes (producte_id, autor, text, puntuacio) VALUES (?, ?, ?, ?)'
        )
        .run(producteIdNumeric, autorNormalitzat, textNormalitzat, puntuacioNumeric);

      return res.status(201).json({ id: Number(resultat.lastInsertRowid) });
    } catch (error) {
      return res.status(400).json({ error: 'No s’ha pogut guardar la ressenya.' });
    }
  });

  return router;
}
