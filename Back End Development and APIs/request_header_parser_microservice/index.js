// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// EMPIEZA NUESTRO CÓDIGO
// Simplemente se obtiene en la ruta especificada la IP de la solicitud, el idioma preferido establecido en el navegador de la solicitud, y el software de la solicitud utilizado para la conexión con el microservicio. 
app.get('/api/whoami',(request, response) => {
  ip = request.ip;
  language = request.headers["accept-language"];
  software = request.headers["user-agent"] ;
  
  response.json({
    "ipaddress": ip,
    "language": language,
    "software": software
  })
})