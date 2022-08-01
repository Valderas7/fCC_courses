# The example function below keeps track of the opponent's history and plays whatever the opponent played two plays ago. It is not a very good player so you will need to change the code to pass the challenge.

dictionary = {}

def player(prev_play, opponent_history=[]):
  global dictionary # read and write variable inside the function

  n = 5

  if prev_play in ["R","P","S"]:
    opponent_history.append(prev_play) # append to the opponent history list

  guess = "R" # default

  if len(opponent_history)>n:
    inp = "".join(opponent_history[-n:]) # join all items of the opponent history list into a string

    if "".join(opponent_history[-(n+1):]) in dictionary.keys():
      dictionary["".join(opponent_history[-(n+1):])]+=1
    else:
      dictionary["".join(opponent_history[-(n+1):])]=1

    possible =[inp+"R", inp+"P", inp+"S"]

    for i in possible:
      if not i in dictionary.keys():
        dictionary[i] = 0

    predict = max(possible, key=lambda key: dictionary[key])

    if predict[-1] == "P":
        guess = "S"
    if predict[-1] == "R":
        guess = "P"
    if opponent_history[-1] == "S":
        guess = "R"

    return guess