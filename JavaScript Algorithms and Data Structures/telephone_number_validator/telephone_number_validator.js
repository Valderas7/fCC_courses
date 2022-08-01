// Expresiones regulares de los seis ejemplos de la izquierda.
let regex1 = /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}$/;
let regex2 = /^[(][0-9]{3}[)][0-9]{3}[-][0-9]{4}$/;
let regex3 = /^[(][0-9]{3}[)][\s][0-9]{3}[-][0-9]{4}$/;
let regex4 = /^[0-9]{3}[\s][0-9]{3}[\s][0-9]{4}$/;
let regex5 = /^[0-9]{10}$/;
let regex6 = /^[1]{1}[\s|-][0-9]{3}[\s|-][0-9]{3}[\s|-][0-9]{4}$/;

// Expresiones regulares de los ejemplos restantes.
let regex7 = /^[1]{1}\s[(][0-9]{3}[)]\s[0-9]{3}[-][0-9]{4}$/;
let regex8 = /^[1]{1}[(][0-9]{3}[)][0-9]{3}[\s|-][0-9]{4}$/;

function telephoneCheck(str) {
  if (str.match(regex1) || str.match(regex2) || str.match(regex3) || str.match(regex4) || str.match(regex5) || str.match(regex6) || str.match(regex7) || str.match(regex8)) {
    return true;
  }
  return false;
}

telephoneCheck("555-555-5555");