// Tabla de referencia
let UNIT_AMOUNT = [
  ["PENNY", .01],
  ["NICKEL", .05],
  ["DIME", .10],
  ["QUARTER", .25],
  ["ONE", 1.00],
  ["FIVE", 5.00],
  ["TEN", 10.00],
  ["TWENTY", 20.00],
  ["ONE HUNDRED", 100.00]
]

// De mayores a menores cantidades:
UNIT_AMOUNT = UNIT_AMOUNT.reverse();

function checkCashRegister(price, cash, cid) {
  let total_cid = 0;
  for (let i = 0; i < cid.length; i++) {
    total_cid += cid[i][1];
  }
  total_cid = total_cid.toFixed(2);

  let difference = (cash - price); // Dos decimales.
  let newArr = [];

  // Si la diferencia entre el pago y el precio de compra es mayor que la cantidad de dinero en la caja registradora, los fondos son insuficientes:
  if (difference > total_cid) {
    return {status: "INSUFFICIENT_FUNDS", change: newArr}
  }
  else if (difference == total_cid) {
    return {status: "CLOSED", change: cid}
  }
  else if (difference < total_cid) {
    cid = cid.reverse();
    for (let i = 0; i < cid.length; i++) {
      // Crea sub-arrays para cada [moneda, cantidad] en cada iteración:
      let temp = [cid[i][0], 0]; 
      // Bucle while se repite para cada moneda mientras la deuda sea mayor que el precio unitario de la moneda correspondiente y haya dinero disponible de esa moneda en la caja registradora:
      while (difference >= UNIT_AMOUNT[i][1] && (cid[i][1] > 0)){
        temp[1] = temp[1] + UNIT_AMOUNT[i][1];
        cid[i][1] = cid[i][1] - UNIT_AMOUNT[i][1];
        difference = difference - UNIT_AMOUNT[i][1];
        difference = difference.toFixed(2);
      }
      // Añade cada subarray al nuevo array en cada iteración:
      if (temp[1] > 0) {
        newArr.push(temp);
      }
    }
  }

  // Si la diferencia no se reduce a cero en el último 'else', entonces la deuda no puede ser saldada, por lo que es insuficiente.
  if (difference > 0) {
    return {status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // En caso contrario, la deuda se resuelve y se retorna el array de monedas.
  return {status: "OPEN", change: newArr};
}

console.log(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]))