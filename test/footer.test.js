import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('la pàgina inclou un peu de pàgina amb informació de la botiga', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

  assert.match(html, /<footer>\s*<p>Botiga Copilot · La teva botiga en línia<\/p>\s*<\/footer>/);
});
