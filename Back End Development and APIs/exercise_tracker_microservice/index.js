const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// EMPIEZA NUESTRO CÓDIGO
// Importar mongoose
const mongoose = require('mongoose');

// Importar bodyParser(para usar en el middleware de solicitudes POST que se define posteriormente)
const bodyParser = require("body-parser");
// Middleware para parsear en métodos 'POST' los datos de 'request.body'
const post_Middleware = bodyParser.urlencoded({extended: false});

// Conexión a la base de datos MongoDB creada anteriormente con el archivo .env (SECRET llamado MONGO_URI) creado que contiene el link para conectarse a la base de datos: 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// Hay que crear dos Schema (uno para cada formulario), ya que cada uno de ellos está relacionado con una colección de MongoDB. De esta forma se sabe cual es la información y estructura de los documentos que se van a almacenar por cada URL para esa colección.
let userSchema = new mongoose.Schema({
  username: {type: String, required: true}
});

let exerciseSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: Date, required: false}
});

// Una vez creado los Schema, se crean los constructores modelos, dándole un nombre y usando los Schemas anteriores. De esta forma, ya se pueden crear instancias de los modelos (documentos).
let Exercise = mongoose.model('Exercise', exerciseSchema);
let User = mongoose.model('User', userSchema);

/* Método 'POST' para crear un nuevo usuario. El nombre de usuario está en 'request.body.username ('username' debido a la propiedad 'name' del 'input' del formulario en 'index.html'). 
Se registra un nuevo usuario en la colección MongoDB de usuarios con el nombre de usuario introducido en el formulario y se da una respuesta JSON con el propio nombre de usuario y el '_id' del documento JSON asociado de la base de datos. */
app.post('/api/users', post_Middleware, (request, response) => {
  let newUser = new User({
    username: request.body['username']
  })
  .save((error, user_data) => {
    if (error) {
      response.json("Error creating user.");
    }
    else {
      response.json({
        username: user_data['username'], 
        _id: user_data['_id']
      });
    }
  });
})

// Método 'GET' para obtener la lista de usuarios registrados. Se encuentran todos los usuarios en la colección MongoDB de usuarios. Se itera sobre la información de todos ellos, de forma que se crea un objeto para cada uno de los usuarios con las propiedades del nombre de usuario y el ID, añadiendo cada objeto uno a uno a un array final, que será el que se muestre en la respuesta JSON.
app.get('/api/users', (request, response) => {
  User.find({}, (error, users_data) => {
    if (error) {
      response.json("Error finding registered users.");
    }
    else {
      let users = []; // Array para recopilar cada objeto
      for (let user_data in users_data) {
        let user = {
          username: users_data[user_data]['username'],
          _id: users_data[user_data]['_id']
        }
        users.push(user);
      }
      response.send(users);
    }
  })
})

// Método 'POST' para registrar ejercicios para un usuario (se usa como parámetro el ID del usuario). Primeramente, se encuentra en la colección MongoDB de usuarios el usuario por su ID, y posteriormente, si se encuentra, se añade un nuevo ejercicio en la colección MongoDB de ejercicios con los correspondientes campos del ID del usuario, fecha, duración y descripción. Si se guarda correctamente el ejercicio en la colección MongoDB, entonces se envía una respuesta JSON con toda la información del ejercicio.
app.post('/api/users/:_id/exercises', post_Middleware, (request, response) => {
  User.findById(request.params['_id'], (error, user_data) => {
    if (error) {
      response.json("Error finding user ID.");
    }
    else {
      let date = request.body['date'];
      
      // Si la fecha no está definida o es nula, es la actual:
      if (date === "" || date === undefined) {
        date = new Date();
      }

      let newExercise = new Exercise({
        userId: request.params['_id'],
        date: date,
        duration: request.body['duration'],
        description: request.body['description']
      })
      .save((error, exercise_data) => {
        if (error) {
          response.json("Error saving exercise data. You must fill in all the required data.");
        }
        else {
          response.json({
            _id: exercise_data['userId'],
            username: user_data['username'],
            date: exercise_data['date'].toDateString(),
            duration: exercise_data['duration'],
            description: exercise_data['description']
          });
        }
      });
    }
  });
});

// Método 'GET' para consultar los 'logs' de un usuario (se usa como parámetro el ID del usuario). Opcionalmente se usan como consulta las fechas iniciales y finales y un límite para consultar los 'logs' de un usuario (por eso, se definen las variables para las consultas, y en caso de que se usen en la URL y estén definidas, se usa el valor de la consulta en la variable). Se busca el parámetro 'ID' en la colección MongoDB de usuarios, y si se encuentra dicho ID, se busca dicho ID en la colección MongoDB de ejercicios para recoger todos los que ha realizado el usuario. Una vez realizado esto, se itera sobre cada ejercicio del usuario, recopilando los datos especificados en cada uno de los ejercicios para mostrar finalmente una respuesta JSON recopilando todos los datos de todos los ejercicios.
app.get('/api/users/:_id/logs', (request, response) => {
  let from = request.query['from'];
  if(from !== undefined){
    from = new Date(from);
  }

  let to = request.query['to'];
  if(to !== undefined){
    to = new Date(to);
  }
  
  let limit = request.query['limit'];

  User.findById(request.params['_id'], (error, user_data) => {
    if (error) {
      response.json("The ID you are searching doesn't exist. Please use a valid user's ID.");
    }
    else {
      Exercise.find({userId: user_data['_id']}, (error, exercises_data) => {
        if (error) {
          response.json("There are no exercises for this user. Please, register at least one exercise for this user to see the logs.");
        }
        else {
          let results = {
            username: user_data['username'],
            count: exercises_data.length,
            _id: user_data['_id'],
            log: []
          }
          
          for (let exercise in exercises_data) {
            if(limit === undefined || results['log'].length < limit) {
              if(from === undefined || exercises_data[exercise]['date'] > from) {
                if(to === undefined || exercises_data[exercise]['date'] < to) {
                  let log_property = {
                    description: exercises_data[exercise]['description'],
                    duration: exercises_data[exercise]['duration'],
                    date: exercises_data[exercise]['date'].toDateString(),
                  };
                  results['log'].push(log_property);
                }
              }
            }
          }
          response.json(results);
        }
      });
    }
  });
});