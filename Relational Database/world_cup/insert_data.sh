#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.
echo $($PSQL "TRUNCATE games, teams")

cat games.csv | while IFS="," read YEAR ROUND WINNER OPPONENT WINNER_GOALS OPPONENT_GOALS
do
  # ESTO PARA LA TABLA DE EQUIPOS
  if [[ $WINNER != "winner" ]] || [[ $OPPONENT != "opponent" ]]
  then
    # Obtienes team_id de las dos columnas de equipos
    TEAM_ID_WINNER=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")
    TEAM_ID_LOSER=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")

    # Si no encuentra el ID del equipo ganador, inserta equipo
    if [[ -z $TEAM_ID_WINNER ]]
    then
      INSERT_TEAM_WINNER=$($PSQL "INSERT INTO teams (name) VALUES ('$WINNER')")
      if [[ $INSERT_TEAM_WINNER == "INSERT 0 1" ]]
      then
        echo Inserted into teams, $WINNER
      fi
    fi

    # Si no encuentra el ID del equipo perdedor, inserta equipo
    if [[ -z $TEAM_ID_LOSER ]]
    then
      INSERT_TEAM_LOSER=$($PSQL "INSERT INTO teams (name) VALUES ('$OPPONENT')")
      if [[ $INSERT_TEAM_WINNER == "INSERT 0 1" ]]
      then
        echo Inserted into teams, $OPPONENT
      fi
    fi
  fi

  # ESTO PARA LA TABLA DE PARTIDOS
  if [[ $YEAR != "year" ]] || [[ $ROUND != "round" ]] || [[ $WINNER_GOALS != "winner_goals" ]] || [[ $OPPONENT_GOALS != "opponent_goals" ]]
  then
    # Obtienes team_id (clave foránea) de las dos columnas de equipos para introducirlas en la tabla de partidos
    TEAM_ID_WINNER=$($PSQL "SELECT team_id FROM teams WHERE name='$WINNER'")
    TEAM_ID_LOSER=$($PSQL "SELECT team_id FROM teams WHERE name='$OPPONENT'")

    # Insertar filas en la tabla de partidos
    INSERT_MATCH=$($PSQL "INSERT INTO games (year, round, winner_id, opponent_id, winner_goals, opponent_goals) VALUES ($YEAR, '$ROUND', $TEAM_ID_WINNER, $TEAM_ID_LOSER, $WINNER_GOALS, $OPPONENT_GOALS)")
    if [[ $INSERT_MATCH == "INSERT 0 1" ]]
    then
      echo Inserted into games, $YEAR $ROUND $WINNER vs $OPPONENT
    fi
  fi
done