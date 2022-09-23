require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// EMPIEZA NUESTRO CÓDIGO
// Importar mongoose
const mongoose = require('mongoose');

// Importar bodyParser(para usar en el middleware de solicitudes POST que se define posteriormente)
const bodyParser = require("body-parser");
// Middleware para parsear en métodos 'POST'
const post_Middleware = bodyParser.urlencoded({extended: false});

// Conexión a la base de datos MongoDB creada anteriormente con el archivo .env (SECRET llamado MONGO_URI) creado que contiene el link para conectarse a la base de datos: 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// Hay que crear un Schema, ya que cada uno de ellos está relacionado con una colección de MongoDB. De esta forma se sabe cual es la información y estructura de los documentos que se van a almacenar por cada URL para esa colección.
let URL_Schema = new mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type: Number}
})

// Una vez creado el Schema, se crea el constructor modelo, dándole un nombre y usando el Schema anterior. De esta forma, ya se pueden crear instancias del modelo (documentos).
let URL = mongoose.model('URL', URL_Schema)

// En el 'index.html' se puede ver que se realiza un método 'POST' en la ruta '/api/shorturl' cada vez que se envía una URL en el formulario, por lo que se rutea un método 'POST' a dicha ruta (utilizando como segundo argumento el middleware para poder parsear datos en métodos 'POST').
// Dichos datos se almacenan en 'request.body' y en este caso, toman el valor {"url": "web enviada en el formulario"} debido a la propiedad 'name' ('url') del 'input' del formulario del 'index.html'
app.post('/api/shorturl', post_Middleware, (request, response) => {

// Se almacena en una variable la URL introducida y se define por defecto la variable 'short_url' a uno.
  let url = request.body['url'];
  let short_url = 1;

// Se comprueba si la URL introducida es válida. Si no lo es, se muestra un JSON informando sobre ello
  let regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  if (!url.match(regex)) {
    response.json({
      "error": "invalid url"
    })
    return // Para que el microservicio no crashee
  }
  
// Se busca en la colección de la base de datos el documento con el valor más alto de la propiedad "short_url" para que al introducir una nueva URL, esta propiedad aumente en uno.  
  URL.findOne({})
    .sort({short_url: 'desc'})
    .exec((error, result_found) => {      
  
// Si no hay error y no se encuentra ningún documento, se introduce y guarda una nueva entrada en la colección de la base de datos:
      if (!error && result_found == undefined) {
        new URL({
            original_url: url,
            short_url: short_url,
          })
        .save()
        response.json({
          "original_url": url,
          "short_url": 1
        })
      }
        
// En cambio, si no hay error pero sí se encuentra documento registrado con variable 'short_name', se busca a ver si ya hay un documento JSON que contiene la URL introducida en el formulario. Si ya lo hay, se envía la respuesta JSON con los datos del documento ya existente
      else if(!error && result_found != undefined) {
        URL.findOne({original_url: url}, (error, web) => {
          if (web != null) {
            response.json({
              "original_url": web['original_url'],
              "short_url": web['short_url']
            });
          }
            
// Si en cambio, ese documento no existe se aumenta en uno la variable 'short_url' y se añade el nuevo registro a la colección de la base de datos y se envía la respuesta JSON
          else {
            short_url = result_found['short_url'] + 1;
            new URL({
              original_url: url,
              short_url: short_url,
            })
            .save()
            response.json({
              "original_url": url,
              "short_url": short_url
            })
          }
        })
      }
  })
})

// Método GET para redirigir el navegador a una página web al introducir el parámetro 'short_url' en la barra de direcciones. Para ello se busca en la colección el documento JSON cuya 'short_url' coincida con el parámetro introducido, y se redirige la respuesta a la web introducida en el campo 'original_url' de dicho documento
app.get('/api/shorturl/:short_url', (request, response) => {
  URL.findOne({short_url: request.params.short_url}, (error, result) => {
    if(!error && result != undefined) {
      response.redirect(result['original_url'])
    }
    else {
      response.json('URL not found')
    }
  })
})
