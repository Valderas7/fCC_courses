#!/bin/bash

# Variable para conexión a base de datos
PSQL="psql --username=freecodecamp --dbname=number_guess --tuples-only -c"

# Número aleatorio entre (1-1000).
SECRET_NUMBER=$(($RANDOM % 1000 + (1)))

# Se pregunta el nombre de usuario.
echo "Enter your username:"
read USERNAME

# Consulta para obtener el historial de partidas jugadas y el récord del usuario que realiza la partida.
USERNAME_STATS=$($PSQL "SELECT games_played, best_game FROM users WHERE username = '$USERNAME'")

# Si no existe historial, el usuario es nuevo y se le da la bienvenida.
if [[ -z $USERNAME_STATS ]]
then
  echo "Welcome, $USERNAME! It looks like this is your first time here."

# Si existe historial, se muestra las estadísticas de partidas jugadas y del récord del usuario.
else
  read GAMES_PLAYED BAR BEST_GAME <<< $USERNAME_STATS
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

# Se pregunta por el número secreto.
echo "Guess the secret number between 1 and 1000:"

# Mientras el número aleatorio sea distinto al número supuesto, o éste último este vacío, se cumple todo el bucle.
while [[ -z $GUESS || $GUESS != $SECRET_NUMBER ]]
do
  read GUESS

  # Si se introduce algo como entrada para adivinar el número, el número de intentos aumenta en uno.
  if [[ ! -z $GUESS ]]
  then
    NUMBER_OF_GUESSES=$((NUMBER_OF_GUESSES+1))
    
    # Si se ha introducido algo distinto a un número, se avisa por pantalla de ello.
    if [[ ! $GUESS =~ ^[0-9]+$ ]]
    then
      echo "That is not an integer, guess again:"
    
    # Si el número introducido para adivinar el número es mayor que el número objetivo, se avisa que este último es inferior. 
    elif (( $GUESS > $SECRET_NUMBER ))
    then
      echo "It's lower than that, guess again:"

    # Si el número introducido para adivinar el número es menor que el número objetivo, se avisa que este último es superior. 
    elif (( $GUESS < $SECRET_NUMBER ))
    then
      echo "It's higher than that, guess again:"
    fi
  fi
done

# Cuando se adivine el número aleatorio, se sale del bucle anterior, y se muestra en cuántos intentos se ha adivinado.
echo "You guessed it in $NUMBER_OF_GUESSES tries. The secret number was $SECRET_NUMBER. Nice job!"

# Si el nombre de usuario era nuevo, se introduce en la base de datos su historial de partidas y su récord.
if [[ -z $USERNAME_STATS ]]
then
  HISTORY_RESULT=$($PSQL "INSERT INTO users VALUES('$USERNAME', 1, $NUMBER_OF_GUESSES)")

# Si no, el usuario ya ha jugado anteriormente y se actualiza su historial de partidas y su récord (solo en caso que lo haya mejorado).
elif (( $NUMBER_OF_GUESSES > $BEST_GAME ))
then
  HISTORY_RESULT=$($PSQL "UPDATE users SET games_played = games_played + 1 WHERE username = '$USERNAME'")
else
  HISTORY_RESULT=$($PSQL "UPDATE users SET games_played = games_played + 1, best_game = $NUMBER_OF_GUESSES WHERE username = '$USERNAME'")
fi