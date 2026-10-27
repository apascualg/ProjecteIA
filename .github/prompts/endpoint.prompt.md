---
description: Crea un endpoint nou de l'API amb el seu test
agent: agent
---
Crea l'endpoint **${input: endpoint: mètode i ruta, p. ex. GET/api/categories}**.

Funcionalitat: ${input:funcionalitat:què ha de fer l'endpoint}

1. Segueix l'estructura de [productes.js](../../src/routes/productes.js).
2. Fes servir sempre consultes preparades.
3. Retorna errors en JSON amb el codi HTTP adequat.
4. Afegeix almenys dos tests a la carpeta test/'.
5. Executa npm test i assegura't que tots els tests passen.
6. Al final, mostra una llista dels fitxers creats o modificats.