#!/bin/bash

PSQL="psql -X --username=freecodecamp --dbname=periodic_table --tuples-only -c"

# Si hay argumento al ejecutar el programa entra en el bucle 'if' para hacer la consulta y obtener la información
if [[ $1 ]]
then

  # Si el argumento es un número, se trata del número atómico, por lo que se hace la consulta a la base de datos.
  if [[ $1 =~ ^[0-9]+$ ]]
  then
    ELEMENT=$($PSQL "SELECT * FROM elements WHERE atomic_number = $1")
    ELEMENT_SPLIT_INFO=($ELEMENT)
  # Si el argumento no es un número, se trata del símbolo o del nombre del elemento, y se hace la consulta.
  else
    ELEMENT=$($PSQL "SELECT * FROM elements WHERE symbol = '$1' OR name = '$1'")
    ELEMENT_SPLIT_INFO=($ELEMENT)
  fi

  # Si la consulta devuelve valores (se ha encontrado el elemento), se sigue seleccionando información.
  if [[ $ELEMENT ]]
  then
    # La información consultada se separa en tres variables: el número atómico, el símbolo y el nombre del elemento seleccionado.
    ATOMIC_NUMBER=${ELEMENT_SPLIT_INFO[0]}
    SYMBOL=${ELEMENT_SPLIT_INFO[2]}
    NAME=${ELEMENT_SPLIT_INFO[4]}
    
    # Obtenida la información consultada en la tabla de elementos, se consulta la información de las tablas de propiedades y tipos.
    ELEMENT_PROPERTIES=$($PSQL "SELECT * FROM properties INNER JOIN types USING (type_id) WHERE atomic_number = $ATOMIC_NUMBER")
    PROPERTIES_SPLIT_INFO=($ELEMENT_PROPERTIES)

    # La información consultada se separa en variables y se escogen los datos que nos interesan.
    TYPE=${PROPERTIES_SPLIT_INFO[10]}
    ATOMIC_MASS=${PROPERTIES_SPLIT_INFO[4]}
    MELTING_POINT=${PROPERTIES_SPLIT_INFO[6]}
    BOILING_POINT=${PROPERTIES_SPLIT_INFO[8]}

    # Se imprime el mensaje pedido en el enunciado
    echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $ATOMIC_MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
  
  # Si la consulta no devuelve valores es porque no se encuentra el elemento, y se imprime el mensaje de abajo.
  else 
    echo "I could not find that element in the database."
  fi

# Si no hay argumento al ejecutar el programa, se especifica que hay que dar un argumento.
else
  echo "Please provide an element as an argument."
fi