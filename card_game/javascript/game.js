//This file contains all the scripts necessary to run the functionality of the game.

var cardPlayed;
var index;
var goalIndex;
var Result;
var interval;
var added;
var trailNumber = 0;

jatos.onLoad(timercount()); // starts timer

// A variable to hold many of the game's variables
var Game = {
  hasPickedUp: -1, //indicator as to if the player has placed a card, if they have the value is the id of the card else its value is -1.
  duration: data[trailNumber].numberOfCards, //The number of remaining turns in a trial.
  goalValue: data[trailNumber].goalValue, //An array holding one array for each player, which represents the value of each goal to that player.
  numberOfGoals: data[trailNumber].goalValue[0].length, // the number of goals 

  valueToTie: 0, //The value gained by each player in the result of a tie for any goal.
  probabilityOfProgress: data[trailNumber].probabilityOfProgress, //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
  progress: data[trailNumber].progress, //The progress made by each player towards each goal.

  goalOpen: data[trailNumber].goalOpen, // If the players can place cards in each lane
  score: [0, 0], //The total score for each player.
  turnNumber: 0, // The turn number, initialised to 0. Increment during gameplay
  cardImage: "https://cdn.pixabay.com/photo/2015/08/11/11/57/spades-884197_960_720.png" // reference for the image used as the card.
};

// A variable to define the cards
var Cards = {
  count: data[trailNumber].numberOfCards, //The number of cards avaliable to each player at start of game
  value: new Array(), //An array to hold the value of each card
  image: new Array(), //An array to hold the image for each card corresponding to its value
  playable: new Array() //An array to hold if the card is playable
};

/* 	@function stoptimer
	clears the timer set as interval 
*/
function stoptimer() {
  clearInterval(interval);
}

/* 	@function timercount
	increments interval variable every 1000 miliseconds
*/
function timercount() {
  interval = setInterval(function() {
    resultsdata.timespent++;
  }, 1000);
}

// A variable to hold all the results to be parsed to JATOS
var resultsdata = {
	numberOfCards: Cards.count, // a variable that holds the number of cards given to the players copyed from Cards object
	goalValue: Game.goalValue,  // a variable that holds all the goal values as an array of an array where the first array is the player and the inner array is the values
	numberOfGoals: Game.numberOfGoals, // a variable that holds the number of goals copyed from Game object
	player1: new Array(), // a variable that holds the progress of player one as an array of arrays where the outer array is the turns and each each turn is an array of the progress for each goal on that turn.
	player2: new Array(), // a variable that holds the progress of player two as an array of arrays where the outer array is the turns and each each turn is an array of the progress for each goal on that turn.
	timespent: 0, // a variable that holds the number of seconds elapesed since the trail began.
	trailendscore: new Array() // a varialbe that holds the score for each player at the end of the trail.
};

/*	@function generateGoals
	A function to add HTML corresponding to the amount of goals (which is defined in the Game object).
*/
function generateGoals() {

  var html = "";
  
  for (var i = 0; i < Game.numberOfGoals; i++) {
    var ii = i.toString(); //To be inserted into the HTML to find the right goals.

    var imagesProgressPlayer = "";
    var imagesProgressOpponent = "";

    for (var j = 0; j < Game.progress[0][i]; j++) {
      imagesProgressPlayer += "<img src=" + Game.cardImage + ">";
    }
	
	var opponentProgress = "0";
	
    if(data[trailNumber].showOpponentProgress) {
		for (var j = 0; j < Game.progress[1][i]; j++) {
			imagesProgressOpponent += "<img src=" + Game.cardImage + ">";
		}
		opponentProgress = Game.progress[1][i].toString()
    }

    html +=
      '<div><div class="player value"><h1>' +
      Game.goalValue[0][i].toString() +
      '</h1></div><div class="opponent value"><h1>' +
      Game.goalValue[1][i].toString() +
      '</h1></div><div class="box playerBox" ondrop="drop(event);" ondragover="allowDrop(event);">' +
      imagesProgressPlayer +
      '</div><div class="box opponentBox" ondrop="drop(event);" ondragover="allowDrop(event);">' +
      imagesProgressOpponent +
      '</div><div class="goal" id="goal' +
      ii +
      '"><div class="left score"><h3 id="score0_' + 
      ii +
      '">' +
      Game.progress[0][i].toString() +
      '</h3></div><div class="right score"><h3 id=score1_' + ii + '>' +
      opponentProgress +
      "</h3></div></div></div>";

    document.getElementById("goals").innerHTML = html;
  }
}

/*	@function updateScore
	A function to calculate the score, it also updates the progress displayed in the middle of the board for both players
*/
function updateScore() {

  Game.score = [0, 0];
  for (var i = 0; i < Game.numberOfGoals; i++) {
    
	document.getElementById("score0_" + i.toString()).innerHTML = Game.progress[0][i];
	
	if(data[trailNumber].showOpponentProgress) {
		document.getElementById("score1_" + i.toString()).innerHTML = Game.progress[1][i];
	}
	
    if (Game.progress[1][i] < Game.progress[0][i]) {
		
		if(typeof(Game.goalValue[0][i]) != "number") {
			var range = Game.goalValue[0][i].split("-", 2);
			if(Game.turnNumber == Game.duration) {
				Game.score[0] += Math.round((parseInt(range[1]) - parseInt(range[0])) * Math.random() + parseInt(range[0]));
			}	
			else {	
				Game.score[0] += (parseInt(range[0])+parseInt(range[1]))/2;
			}
		} 
		else {
			Game.score[0] += Game.goalValue[0][i];
		}  

    } else if (Game.progress[1][i] > Game.progress[0][i]) {
		
		if(typeof(Game.goalValue[1][i]) != "number") {
			var range = Game.goalValue[1][i].split("-", 2);
			if(Game.turnNumber == Game.duration) {
				Game.score[1] += Math.round((parseInt(range[1]) - parseInt(range[0])) * Math.random() + parseInt(range[0]));
			}
			else {
				Game.score[1] += (parseInt(range[0])+parseInt(range[1]))/2;
			}
		} 
		else {
			Game.score[1] += Game.goalValue[1][i];
		}
    } 
	else {
		Game.score[0] += Game.valueToTie;
		Game.score[1] += Game.valueToTie;
    }
	
    if(data[trailNumber].showOpponentProgress) {
		document.getElementById("YourScore").innerHTML = "Your score: " + Game.score[0].toString();
		document.getElementById("OpponentScore").innerHTML = "Opponent score: " + Game.score[1].toString();
	}
  }
}

/*	@function generateCards 
	A function to create the cards for the player using the card image and adding the functions for dragging.
*/
function generateCards(number) {
  var html = "";

  for (var i = 0; i < Cards.count; i++) {
    Cards.value[i] = 1;
    Cards.image[i] = new Image();
    Cards.image[i].src = Game.cardImage;

    html +=
      '<img id="card' +
      i.toString() +
      '" src="' +
      Cards.image[i].src +
      '" alt="" ' +
      ');" draggable="true" ondragstart="drag(event);" />';
    Cards.playable[i] = false;
  }
  document.getElementById("cards").innerHTML = html; //Inserts the above HTML into the 'cards' div.

}

/*	@function drag
	A function called when a card is dragged, it records the index of the card and transfers the dragged card
	@param card, is the card object being dragged
*/
function drag(card) {
  //Collects the ID of the card as it begins to get dragged.
  index = parseInt(card.target.id[card.target.id.length - 1]);
  if (Game.hasPickedUp == -1) {
    Game.hasPickedUp = index;
  }
  if (Cards.playable[index] == false && Game.hasPickedUp == index) {
    card.dataTransfer.setData("text", card.target.id);
  }

}

/*	@function allowDrop
	A function to determine if the card can be dropped targeted lane
	@param card, is the card object being dropped
*/
function allowDrop(card) {
  //Allows the card boxes to accept cards.
  if (Cards.playable[index] == false && Game.hasPickedUp == index) {
    var goal = card.target.parentNode.lastChild;
    var goalIndex = goal.id[goal.id.length - 1];
    var isPlayerbox = card.target.className === "box playerBox"; // Checks class name to determine if this is the players box
    if (Game.goalOpen[0][goalIndex] && isPlayerbox) {
      card.preventDefault();
    }
  }
}

/*	@function drop
	A function to append the card object to the targeted lane also tells the game if a card has been played by seeting cardPlayed to true.
	@param card, is the card object that should be moved
*/
function drop(card) {

  card.preventDefault();
  var cardId = card.dataTransfer.getData("text"); //Gets the ID of card from the drag(card) function.
  if (cardId != "") {
    index = data[data.length - 1];
    var goal = card.target.parentNode.lastChild.id; //Retrieves the ID of the goal it was dragged to.
    goalIndex = parseInt(goal[goal.length - 1]); //Extracts the goal number from its ID.
	card.target.appendChild(document.getElementById(cardId)); //Moves the dragged card to the box in which it was dropped.
  }
  cardPlayed = true;
  document.getElementById("endTurn").className = "endTurnButton ready";
}

/*	@function start
	A function that calls generateGoals and generateCards
*/
function start() {
	generateGoals();
	generateCards(); 
}

/*	@function incrementScore
	A function to increment the score of a player at a particular goal. uses random number to 
	@param player, [0 or 1] to indicate what player the score is added to
	@param score, to increment progress by
	@param goalNumber, the goal index [int] to add points to.
	@return int, 1 if the score was added, 0 otherwise
*/
function incrementScore(player, scoreToAdd, goalNumber) {
	if(Math.random() <= Game.probabilityOfProgress[player]) {
		Game.progress[player][goalNumber] += scoreToAdd;
		return 1;
	}
	return 0;
}

/* 	Example function to show how you can make Opponents that dynamically add cards
	Any number of functions can be added but they will only be called if their name is put in the opponent var in the int.js
*/
function mirrorOpponent() {
	incrementOpponent(goalIndex, 1);
}

/*	@function incrementOppoent
	A function to increases the opponents progress by scoreToAdd in the for the goalToIncrement lane.
	@param score, to increment progress by
	@param goalNumber, the goal index [int] to add points to.
*/
function incrementOpponent(goalToIncrement, scoreToAdd) {
	var addedOpponent = incrementScore(1, scoreToAdd, goalIndex);

	if(addedOpponent == 1 && data[trailNumber].showOpponentProgress) {
		document.getElementById("goal"+goalToIncrement).previousSibling.innerHTML += "<img src=" + Game.cardImage + ">";
	}
}

/* 	@function endTurn
	A function called when the turn ends, checks if a card has been played. if it has then it calls the AI function if one is specified in the int.js
	then resets the turn unless the player has played all their cards in which case it calls endGame
*/
function endTurn() {
  if (Game.turnNumber < Game.duration) {
    if (cardPlayed != true) {
		alert("Place a card"); //Error message if no card is placed, only needed if the end turn button can be pressed before a card has been placed
    } else {
		Game.turnNumber++;
		
		added = incrementScore(0, Cards.value[Game.hasPickedUp], goalIndex);
		
		if(added == 0) { 
			document.getElementById("card"+Game.hasPickedUp).src = "";
			document.getElementById("card"+Game.hasPickedUp).draggable = false;
		}
	  
		if(data[trailNumber].opponent != "false") {
			window[data[trailNumber].opponent](1, 1);
		}
		
		updateScore();
	  
		//10-10-2019(Tony) pushes the progress of each player to result every turn- seems to be changing as the game goes on
		var player1progress = JSON.parse(JSON.stringify(Game.progress[0]));
		var player2progress = JSON.parse(JSON.stringify(Game.progress[1]));

		resultsdata.player1.push(player1progress);
		resultsdata.player2.push(player2progress);

		yourTurn = false;
		Cards.playable[Game.hasPickedUp] = true;
		cardPlayed = false;
		goalIndex = null;
		Game.hasPickedUp = -1;
		document.getElementById("endTurn").className = "endTurnButton";

		if (Game.turnNumber >= Game.duration) {
		endGame();
		}
    }
  }
}

/*	@function endGame
	A function that is called when the game ends, it parses the results to JATOS and shows the results of the trail before calling the nextComponent
*/
function endGame() {
  
  stoptimer();
  
  resultsdata.trailendscore[0] = Game.score[0];
  resultsdata.trailendscore[1] = Game.score[1];

  console.log("player score: " + Game.score[0]);
  console.log("opponent score: " + Game.score[1]);
  
  var results = document.getElementById("results");
  results.innerHTML =
    "<h1>RESULTS</h1><hr>" +
    "<p>You scored: " +
    Game.score[0].toString() +
    ".</p>" +
    "<p>Your opponent scored: " +
    Game.score[1].toString() +
    ".</p>";

  if (Game.score[0] > Game.score[1]) {
    results.innerHTML += "<h3>You won!</h3>";
  } else if (Game.score[0] == Game.score[1]) {
    results.innerHTML += "<h3>It's a draw!</h3>";
  } else {
    results.innerHTML += "<h3>You lost!</h3>";
  }

  document.getElementById("backgroundblur").style.display = "none";
  results.style.display = "block";
  
  jatos.appendResultData(resultsdata); //used to append results of this trail to the array of results of all trails
  trailNumber++;
  
  if(1/*trailNumber >= data.length*/) {
	setTimeout(jatos.startNextComponent, 3000); // starts the next component after waiting 3 seconds
  }

}

/*	@function overlay
	A function called when the help button is released, it toggles the help overlay and the blur on the background
*/
function overlay() {
  var overlay = document.getElementById("overlay");
  var containerElement = document.getElementById("backgroundblur");
  if (overlay.style.display == "none") {
    overlay.style.display = "block";
    containerElement.setAttribute("class", "blur");
  } else {
    overlay.style.display = "none";
    containerElement.setAttribute("class", null);
  }
}
