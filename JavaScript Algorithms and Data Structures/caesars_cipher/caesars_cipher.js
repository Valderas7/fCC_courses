// Alfabeto del mensaje en mayúsculas
const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase()
const regex = /\w/; // Letras

function rot13(str) {
  let newArr = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i].match(regex)) {
      // Se busca índice de la letra en el alfabeto y se retrasa trece posiciones
      let index = (alphabet.indexOf(str[i]) - 13);
      // Si el índice es menor de cero daría error, así que en ese caso se resta la longitud con el índice negativo
      if (index < 0) {
        index = alphabet.length + index;
      }
      newArr.push(alphabet[index]);
    }
    // Si no concuerda la expresión regular, se añade al array el espacio o símbolo que toca.
    else {
      newArr.push(str[i]);
    }
  }
  newArr = newArr.join("");
  return newArr;
}

rot13("SERR PBQR PNZC");