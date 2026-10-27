/**
 * Calcula el total del carret aplicant un descompte percentual.
 * @param {Array<{preu: number, quantitat: number}>} items
 * @param {number} descompte Percentatge entre 0 i 100.
 * @returns {number} Total arrodonit a 2 decimals.
 * @throws {RangeError} Si el descompte és fora de rang.
 */
export function calcularTotal(items, descompte = 0) {
  if (descompte < 0 || descompte > 100) {
    throw new RangeError('El descompte ha de ser entre 0 i 100');
  }
  let subtotal = 0;
  for (const item of items) {
    subtotal += Number(item.preu || 0) * Number(item.quantitat || 0);
  }
  const total = subtotal * (1 - descompte / 100);
  return Math.round(total * 100) / 100;
}

function arrodonir2(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function calcularPesTotal(items) {
  let pesTotal = 0;
  for (const item of items) {
    const pesUnitat = Number(item.pes ?? 0.5);
    const quantitat = Number(item.quantitat || 0);
    pesTotal += pesUnitat * quantitat;
  }
  return arrodonir2(pesTotal);
}

export function calcularCarret(items = [], descompte = 0) {
  if (descompte < 0 || descompte > 100) {
    throw new RangeError('El descompte ha de ser entre 0 i 100');
  }

  let subtotal = 0;
  for (const item of items) {
    subtotal += Number(item.preu || 0) * Number(item.quantitat || 0);
  }

  const subtotalDescompte = arrodonir2(subtotal * (1 - descompte / 100));
  let enviament = 0;

  if (subtotalDescompte <= 50) {
    const pesTotal = calcularPesTotal(items);
    if (pesTotal <= 1) {
      enviament = 3.9;
    } else if (pesTotal <= 5) {
      enviament = 5.9;
    } else {
      enviament = 9.9;
    }
  }

  const total = arrodonir2(subtotalDescompte + enviament);

  return {
    subtotal: subtotalDescompte,
    enviament: arrodonir2(enviament),
    total,
  };
}
