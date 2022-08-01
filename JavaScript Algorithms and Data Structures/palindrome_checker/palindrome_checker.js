let regex = /[a-z0-9]/g; // Caracteres Word global
let newArr = [];

// A minúsculas y quednándonos solo con caracteres alfanuméricos.
function palindrome(str) {
  str = str.toLowerCase().match(regex);

  // Comparación de primera-última, segunda-penúltima,etc. en el array
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[(str.length - i - 1)]) {
      continue;
    }
    else {
      return false;
    }
  }
  return true;
}

console.log(palindrome("not a palindrome"));