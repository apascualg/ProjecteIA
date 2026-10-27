import { Router } from 'express';
import { calcularCarret } from '../utils/carret.js';

export function routerCarret() {
  const router = Router();

  // POST /api/carret/total  { items: [{ preu, quantitat, pes? }], descompte }
  router.post('/total', (req, res) => {
    const { items = [], descompte = 0 } = req.body;
    try {
      const { subtotal, enviament, total } = calcularCarret(items, descompte);
      res.json({ subtotal, enviament, total });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
