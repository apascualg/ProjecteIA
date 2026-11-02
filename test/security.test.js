import { test } from 'node:test';
import assert from 'node:assert/strict';

import { normalitzaCategoria } from '../src/routes/productes.js';
import { crearBaseDades } from '../src/db.js';

test('normalitzaCategoria rebutja valors no permesos', () => {
  assert.equal(normalitzaCategoria("roba' UNION SELECT id,email,contrasenya,rol,0 FROM usuaris--"), null);
  assert.equal(normalitzaCategoria('roba'), 'roba');
});

test('crearBaseDades no guarda contrasenyes en text pla', () => {
  const db = crearBaseDades();
  const usuaris = db.prepare('SELECT email, contrasenya FROM usuaris').all();

  for (const usuari of usuaris) {
    assert.notEqual(usuari.contrasenya, 'Admin2026!');
    assert.notEqual(usuari.contrasenya, 'client123');
    assert.match(usuari.contrasenya, /\$pbkdf2\$/);
  }
});
