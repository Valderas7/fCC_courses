var express = require('express');
var cors = require('cors');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

// EMPIEZA NUESTRO CÓDIGO
// En este ejercicio, aunque se utiliza el método 'POST', no hace falta el middleware bodyParser, puesto que no se recogen datos de 'request.body'

// Importar Multer (para controlar la subida de archivos)
const multer = require('multer')

// Método 'POST' que acepta un único archivo con el nombre del campo especificado en el formulario ('upfile', porque la propiedad 'name' del 'inputfield' del formulario se llama así, tal y como se puede ver en 'index.html'). La información de subida de dicho archivo será guardado en 'request.file'.
// Al subirlo, se da una respuesta JSON con el nombre original de archivo en nuestro PC, el mime type del archivo y el tamaño en bytes del mismo.
app.post('/api/fileanalyse', multer({dest: 'uploads/'}).single('upfile'), (request, response) => {
  response.json({
    "name": request.file['originalname'],
    "type": request.file['mimetype'],
    "size": request.file['size']
  })
})