import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('la pàgina inclou un peu de pàgina amb informació de la botiga', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

  assert.match(html, /<footer>\s*<p>Botiga Copilot · La teva botiga en línia<\/p>\s*<\/footer>/);
});

test('el peu de pàgina carrega Montserrat Light i aplica animació d’entrada', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../public/styles.css', import.meta.url), 'utf8');

  assert.match(html, /fonts\.googleapis\.com\/css2\?family=Montserrat:wght@300/);
  assert.match(css, /footer p\s*\{[\s\S]*font-family:\s*'Montserrat', system-ui, sans-serif;[\s\S]*font-weight:\s*300;[\s\S]*animation:\s*entradaPeu 600ms ease-out;/);
  assert.match(css, /@keyframes entradaPeu/);
});
