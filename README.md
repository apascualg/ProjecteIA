# Botiga Copilot

Mini-botiga en línia per practicar la programació assistida amb GitHub Copilot.

## Requisits

- Node.js 22.13 o superior (recomanat: Node.js 24 LTS)

## Instal·lació i execució

```bash
npm install
npm start
```

Obre <http://localhost:3000> al navegador.

## Endpoints de l'API

### Productes
- `GET /api/productes` — retorna tots els productes, amb `mitjana` i `numRessenyes` per producte.
- `GET /api/productes?categoria=roba` — retorna productes filtrats per categoria.
- `GET /api/productes/:id` — retorna un producte concret.

### Ressenyes
- `GET /api/ressenyes?producteId=1` — retorna les ressenyes d'un producte.
- `POST /api/ressenyes` — crea una nova ressenya.

### Carret
- `POST /api/carret/total` — calcula el subtotal, l'enviament i el total final del carret.

## Tests

Per executar la suite de proves:

```bash
npm test
```

També es pot executar directament amb Node.js:

```bash
node --test
```

Aquesta comanda llança tots els tests del projecte i comprova que les funcionalitats del backend i la UI bàsica segueixen funcionant.

## Estructura

```
src/
  index.js          Punt d'entrada: inicia el servidor
  app.js            Configuració d'Express i rutes
  config.js         Configuració de l'aplicació
  db.js             Base de dades SQLite en memòria amb dades de prova
  routes/           Rutes de l'API
    productes.js     Llistat, filtre i mitjana de productes
    ressenyes.js     Llista i creació de ressenyes
    carret.js        Càlcul del total del carret
  utils/carret.js   Lògica de subtotal, enviament i totals
public/             Frontend (HTML, CSS i JavaScript)
test/               Tests amb el runner integrat de Node.js
docs/               Documentació de proveïdors externs
```
