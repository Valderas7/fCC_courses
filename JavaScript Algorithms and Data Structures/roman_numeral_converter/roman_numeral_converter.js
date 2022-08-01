// Array de tabla
const roman = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1]
 ];

// Función conversión decimal - romano
function convertToRoman(num) {
  // Cuando todas las letras estén escritas se sale de la recursión (función invoca función)
  if (num == 0) {
    return '';
  }
  // Bucle para escribir letras romanas 
  for (let i = 0; i < roman.length; i++) {
    if (num >= roman[i][1]) {
      return(roman[i][0]) + convertToRoman(num - roman[i][1]);
    }
  }
}

console.log(convertToRoman(36));