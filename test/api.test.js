import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { crearBaseDades } from '../src/db.js';

let servidor;
let base;

before(() => {
  servidor = crearApp(crearBaseDades()).listen(0);
  base = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

test('GET /api/productes retorna tots els productes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  assert.equal(resposta.status, 200);
  const productes = await resposta.json();
  assert.equal(productes.length, 6);
});

test('GET /api/productes retorna la mitjana correcta d’un producte amb ressenyes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  const productes = await resposta.json();

  const producte = productes.find((p) => p.id === 1);
  assert.equal(producte.mitjana, 4);
  assert.equal(producte.numRessenyes, 2);
});

test('GET /api/productes retorna null i 0 per a un producte sense ressenyes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  const productes = await resposta.json();

  const producte = productes.find((p) => p.id === 2);
  assert.equal(producte.mitjana, null);
  assert.equal(producte.numRessenyes, 0);
});

test('POST /api/carret/total retorna subtotal, enviament i total', async () => {
  const resposta = await fetch(`${base}/api/carret/total`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { preu: 20, quantitat: 1, pes: 0.8 },
        { preu: 15, quantitat: 1, pes: 0.5 },
      ],
      descompte: 0,
    }),
  });

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), {
    subtotal: 35,
    enviament: 5.9,
    total: 40.9,
  });
});

test('GET /api/productes?categoria=roba filtra per categoria', async () => {
  const resposta = await fetch(`${base}/api/productes?categoria=roba`);
  const productes = await resposta.json();
  assert.ok(productes.every((p) => p.categoria === 'roba'));
});

test('GET /api/productes/:id retorna 404 si no existeix', async () => {
  const resposta = await fetch(`${base}/api/productes/999`);
  assert.equal(resposta.status, 404);
});
