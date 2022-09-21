// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// EMPEZAMOS A PROGRAMAR AQUÍ:
// Ruteado al endpoint con el parámetro 'date' con respuesta JSON. 
app.get('/api/:date', (request, response) => {
  let parameter = request.params.date;
    
  // Si el parámetro tiene guiones es una fecha (YYYY-MM-DD):
  if (parameter.includes('-')) {
    let date = new Date(parameter); // YYYY-MM-DDTHH:MM:SS.MSMSMSZ

    // Si al convertir la fecha el resultado no es una fecha válida, se muestra en el JSON:
    if(date == 'Invalid Date') {
      response.json({
        "error": "Invalid Date"
      })
    }
    // Si en cambio sí es una fecha válida, pues se muestra los tiempos UNIX y UTC:
    else {
      response.json({
      "unix": date.getTime(), // Timestamp (marca temp.)
      "utc": date.toUTCString() // Fri, DD Mon YYYY HH:MM:SS GMT
      })
    }
  }

  // Si el parámetro tiene espacio es una fecha (Day Month Year):
  else if (parameter.includes(' ')) {
    let date = new Date(String(parameter)) // Convierte a string la fecha, y posteriormente a formato YYYY-MM-DDTHH:MM:SS.MSMSMSZ
    
    // Si al convertirlo a este último formato no es una fecha válida, se muestra en el JSON:
    if(date == 'Invalid Date') {
      response.json({
        "error": "Invalid Date"
      })
    }
    // Si en cambio sí es una fecha válida, pues se muestra los tiempos UNIX y UTC:
    else {
      response.json({
      "unix": date.getTime(), // Timestamp (marca temp.)
      "utc": date.toUTCString() // Fri, DD Mon YYYY HH:MM:SS GMT
      })
    }
  }

  // Si el parámetro no tiene guiones es un timestamp:
  else {
      // Se parsea la marca temporal como número entero y se convierte a una nueva fecha, para transformarlo a formato YYYY-MM-DDTHH:MM:SS.MSSZ
    let date = new Date(parseInt(request.params.date))
    
    // Si al convertirlo a este último formato no es una fecha válida, se muestra en el JSON:
    if(date == 'Invalid Date') {
      response.json({
        "error": "Invalid Date"
      })
    }
    // Si en cambio sí es una fecha válida, pues se muestra los tiempos UNIX y UTC
    else {
      response.json({
        "unix": date.getTime(), // Timestamp
        "utc": date.toUTCString() // Fri, DD Mon YYYY HH:MM:SS GMT
      })  
    }
  }
})

// En el caso en el que no hay parámetros, se responde con un JSON con los tiempos UNIX y UTC actuales:
app.get('/api', (request, response) => {
  let date = new Date(parseInt(Date.now())) // Se consigue fecha actual en formato YYYY-MM-DDTHH:MM:SS.MSSZ

  response.json({
  "unix": date.getTime(), // Timestamp
  "utc": date.toUTCString() // Fri, DD Mon YYYY HH:MM:SS GMT
    })
})