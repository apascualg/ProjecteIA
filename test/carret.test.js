import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularCarret, calcularTotal } from '../src/utils/carret.js';

test('calcula el subtotal, enviament i total amb tarifes de pes', () => {
  const items = [
    { preu: 20, quantitat: 1, pes: 0.8 },
    { preu: 15, quantitat: 1, pes: 0.5 },
  ];

  const resultat = calcularCarret(items, 0);

  assert.deepEqual(resultat, {
    subtotal: 35,
    enviament: 5.9,
    total: 40.9,
  });
});

test('aplica enviament gratuït si el subtotal després de descompte supera 50 €', () => {
  const items = [
    { preu: 30, quantitat: 2, pes: 0.5 },
  ];

  const resultat = calcularCarret(items, 10);

  assert.deepEqual(resultat, {
    subtotal: 54,
    enviament: 0,
    total: 54,
  });
});

test('calcula el total sense descompte', () => {
  const items = [
    { preu: 10, quantitat: 2 },
    { preu: 5.5, quantitat: 1 },
  ];
  assert.equal(calcularTotal(items), 25.5);
});

test('aplica un descompte percentual', () => {
  const items = [{ preu: 20, quantitat: 2 }];
  assert.equal(calcularTotal(items, 25), 30);
});

test('un carret buit val 0', () => {
  assert.equal(calcularTotal([]), 0);
});

test('llança un error si el descompte és fora de rang', () => {
  assert.throws(() => calcularTotal([], 120), RangeError);
});
