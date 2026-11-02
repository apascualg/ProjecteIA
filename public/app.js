const carret = [];

function crearElementText(text, tagName = 'span') {
  const element = document.createElement(tagName);
  element.textContent = text;
  return element;
}

async function carregarProductes(categoria = '') {
  const resposta = await fetch(`/api/productes?categoria=${categoria}`);
  const productes = await resposta.json();
  const contenidor = document.querySelector('#productes');
  contenidor.innerHTML = '';
  for (const p of productes) {
    const mitjana = p.numRessenyes > 0 ? `${Number(p.mitjana).toFixed(1)} / 5` : 'Sense ressenyes';
    const targeta = document.createElement('article');
    targeta.className = 'producte';

    const nom = crearElementText(p.nom, 'h3');
    const preu = crearElementText(`${p.preu.toFixed(2)} €`, 'p');
    const valoracio = crearElementText(`Valoració: ${mitjana}`, 'p');

    const botoAfegeix = document.createElement('button');
    botoAfegeix.type = 'button';
    botoAfegeix.className = 'afegeix';
    botoAfegeix.textContent = 'Afegeix';
    botoAfegeix.addEventListener('click', () => afegirAlCarret(p));

    const botoVeure = document.createElement('button');
    botoVeure.type = 'button';
    botoVeure.className = 'veure';
    botoVeure.textContent = 'Ressenyes';
    botoVeure.addEventListener('click', () => obrirDetall(p));

    targeta.append(nom, preu, valoracio, botoAfegeix, botoVeure);
    contenidor.appendChild(targeta);
  }
}

async function afegirAlCarret(producte) {
  const existent = carret.find((i) => i.id === producte.id);
  if (existent) {
    existent.quantitat++;
  } else {
    carret.push({ id: producte.id, nom: producte.nom, preu: producte.preu, quantitat: 1 });
  }
  await actualitzarCarret();
}

async function actualitzarCarret() {
  const llistaCarret = document.querySelector('#carret');
  llistaCarret.innerHTML = '';

  for (const item of carret) {
    const element = document.createElement('li');
    element.textContent = `${item.nom} × ${item.quantitat}`;
    llistaCarret.appendChild(element);
  }

  const resposta = await fetch('/api/carret/total', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: carret, descompte: 10 }),
  });
  const { subtotal, enviament, total } = await resposta.json();
  document.querySelector('#subtotal').textContent = `${Number(subtotal).toFixed(2)} €`;
  document.querySelector('#enviament').textContent = `${Number(enviament).toFixed(2)} €`;
  document.querySelector('#total').textContent = `${Number(total).toFixed(2)} €`;
}

let producteActual = null;

async function obrirDetall(producte) {
  producteActual = producte;
  document.querySelector('#detall-nom').textContent = producte.nom;
  document.querySelector('#detall-descripcio').textContent = producte.descripcio;
  await carregarRessenyes(producte.id);
  document.querySelector('#detall').showModal();
}

async function carregarRessenyes(producteId) {
  const resposta = await fetch(`/api/ressenyes?producteId=${producteId}`);
  const ressenyes = await resposta.json();
  const llistaRessenyes = document.querySelector('#ressenyes');
  llistaRessenyes.innerHTML = '';

  for (const r of ressenyes) {
    const item = document.createElement('li');
    const autor = document.createElement('strong');
    autor.textContent = r.autor;
    const text = document.createTextNode(` (${r.puntuacio}/5): ${r.text}`);

    item.append(autor, text);
    llistaRessenyes.appendChild(item);
  }
}

document.querySelector('#form-ressenya').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dades = Object.fromEntries(new FormData(e.target));
  await fetch('/api/ressenyes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...dades, producteId: producteActual.id }),
  });
  e.target.reset();
  await carregarRessenyes(producteActual.id);
});

document.querySelector('#tanca').addEventListener('click', () => {
  document.querySelector('#detall').close();
});

document.querySelector('#filtre-categoria').addEventListener('change', (e) => {
  carregarProductes(e.target.value);
});

carregarProductes();
