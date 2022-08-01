#!/bin/bash

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

echo -e "\n~~~~~ MY SALON ~~~~~"
echo -e "\nWelcome to My Salon, how can I help you?\n"

MAIN_MENU() {
  if [[ $1 ]]
  then
    echo -e "\n$1"
  fi

  # Lista de servicios ofrecidos.
  SERVICES_LIST=$($PSQL "SELECT service_id, name FROM services ORDER BY service_id")
  echo "$SERVICES_LIST" | while read ID_SERVICE BAR SERVICE_NAME
  do
    echo "$ID_SERVICE) $SERVICE_NAME"
  done

  # Se lee el servicio seleccionado.
  read SERVICE_ID_SELECTED

  # Si no está dentro de los números 1-5, se vuelve al menú principal.
  if [[ ! $SERVICE_ID_SELECTED =~ ^[1-5]$ ]]
  then
    MAIN_MENU "I could not find that service. What would you like today?"
  else
    SERVICE_NAME_SELECTED=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED")
    echo -e "\nWhat's your phone number?"
    read CUSTOMER_PHONE
    CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone = '$CUSTOMER_PHONE'")

    # Si el nombre no está registrado, se añade a la base de datos.
    if [[ -z $CUSTOMER_NAME ]]
    then
      echo -e "\nI don't have a record for that phone number, what's your name?"
      read CUSTOMER_NAME
      INSERT_CUSTOMER_NAME=$($PSQL "INSERT INTO customers (phone, name) VALUES ('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
      CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone = '$CUSTOMER_PHONE'")
    fi
    
    # Se crea una variable para recoger el ID del vendedor, puesto que se usará para pedir la cita.
    CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE'")

    # Registrado el nombre y el teléfono, se pregunta por la hora de la cita.
    echo -e "\nWhat time would you like your $(echo $SERVICE_NAME_SELECTED | sed 's/^ *| *$//g'), $(echo $CUSTOMER_NAME)?"
    read SERVICE_TIME 
    APPOINTMENT=$($PSQL "INSERT INTO appointments (customer_id, service_id, time) VALUES ($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')")
    
    # Mensaje para indicar que la cita se ha reservado correctamente.
    echo -e "\nI have put you down for a $(echo $SERVICE_NAME_SELECTED | sed 's/^ *| *$//g') at $SERVICE_TIME, $(echo $CUSTOMER_NAME | sed 's/^ *| *$//g')."
  fi
}

MAIN_MENU
