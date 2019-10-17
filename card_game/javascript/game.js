//This file contains all the scripts necessary to run the functionality of the game.

var cardPlayed;
var index;
var goalIndex;
var Result;
var interval;
var added;
var trailNumber = 0;

// A variable constructor to hold many of the game's variables
function Game() {
  this.hasPickedUp = -1; //indicator as to if the player has placed a card, if they have the value is the id of the card else its value is -1.
  this.duration = data[trailNumber].numberOfCards; //The number of remaining turns in a trial.
  this.goalValue = data[trailNumber].goalValue; //An array holding one array for each player, which represents the value of each goal to that player.
  this.numberOfGoals = data[trailNumber].goalValue[0].length; // the number of goals 

  this.valueToTie = 0; //The value gained by each player in the result of a tie for any goal.
  this.probabilityOfProgress = data[trailNumber].probabilityOfProgress; //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
  this.progress = data[trailNumber].progress; //The progress made by each player towards each goal.

  this.goalOpen = data[trailNumber].goalOpen; // If the players can place cards in each lane
  this.score = [0, 0]; //The total score for each player.
  this.turnNumber = 0; // The turn number, initialised to 0. Increment during gameplay
  this.cardImage = "https://cdn.pixabay.com/photo/2015/08/11/11/57/spades-884197_960_720.png"; // reference for the image used as the card.
};

// A variable to define the collection of cards
function Cards() {
  this.count = data[trailNumber].numberOfCards; //The number of cards avaliable to each player at start of game
  this.value = new Array(); //An array to hold the value of each card
  this.image = new Array(); //An array to hold the image for each card corresponding to its value
  this.playable = new Array(); //An array to hold if the card is playable
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
function Resultsdata() {
	this.numberOfCards = cards.count; // a variable that holds the number of cards given to the players copyed from cards object
	this.goalValue = game.goalValue; // a variable that holds all the goal values as an array of an array where the first array is the player and the inner array is the values
	this.numberOfGoals = game.numberOfGoals; // a variable that holds the number of goals copyed from game object
	this.player1 = new Array(); // a variable that holds the progress of player one as an array of arrays where the outer array is the turns and each each turn is an array of the progress for each goal on that turn.
	this.player2 = new Array(); // a variable that holds the progress of player two as an array of arrays where the outer array is the turns and each each turn is an array of the progress for each goal on that turn.
	this.timespent = 0; // a variable that holds the number of seconds elapesed since the trail began.
	this.trailendscore = new Array(); // a varialbe that holds the score for each player at the end of the trail.
};

/*	@function generateGoals
	A function to add HTML corresponding to the amount of goals (which is defined in the game object).
*/
function generateGoals() {

  var html = "";
  
  for (var i = 0; i < game.numberOfGoals; i++) {
    var ii = i.toString(); //To be inserted into the HTML to find the right goals.

    var imagesProgressPlayer = "";
    var imagesProgressOpponent = "";

    for (var j = 0; j < game.progress[0][i]; j++) {
      imagesProgressPlayer += "<img src=" + game.cardImage + ">";
    }
	
	var opponentProgress = "0";
	
    if(data[trailNumber].showOpponentProgress) {
		for (var j = 0; j < game.progress[1][i]; j++) {
			imagesProgressOpponent += "<img src=" + game.cardImage + ">";
		}
		opponentProgress = game.progress[1][i].toString()
    }

    html +=
      '<div><div class="player value"><h1>' +
      game.goalValue[0][i].toString() +
      '</h1></div><div class="opponent value"><h1>' +
      game.goalValue[1][i].toString() +
      '</h1></div><div class="box playerBox" ondrop="drop(event);" ondragover="allowDrop(event);">' +
      imagesProgressPlayer +
      '</div><div class="box opponentBox" ondrop="drop(event);" ondragover="allowDrop(event);">' +
      imagesProgressOpponent +
      '</div><div class="goal" id="goal' +
      ii +
      '"><div class="left score"><h3 id="score0_' + 
      ii +
      '">' +
      game.progress[0][i].toString() +
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

  game.score = [0, 0];
  for (var i = 0; i < game.numberOfGoals; i++) {
    
	document.getElementById("score0_" + i.toString()).innerHTML = game.progress[0][i];
	
	if(data[trailNumber].showOpponentProgress) {
		document.getElementById("score1_" + i.toString()).innerHTML = game.progress[1][i];
	}
	
    if (game.progress[1][i] < game.progress[0][i]) {
		
		if(typeof(game.goalValue[0][i]) != "number") {
			var range = game.goalValue[0][i].split("-", 2);
			if(game.turnNumber == game.duration) {
				game.score[0] += Math.round((parseInt(range[1]) - parseInt(range[0])) * Math.random() + parseInt(range[0]));
			}	
			else {	
				game.score[0] += (parseInt(range[0])+parseInt(range[1]))/2;
			}
		} 
		else {
			game.score[0] += game.goalValue[0][i];
		}  

    } else if (game.progress[1][i] > game.progress[0][i]) {
		
		if(typeof(game.goalValue[1][i]) != "number") {
			var range = game.goalValue[1][i].split("-", 2);
			if(game.turnNumber == game.duration) {
				game.score[1] += Math.round((parseInt(range[1]) - parseInt(range[0])) * Math.random() + parseInt(range[0]));
			}
			else {
				game.score[1] += (parseInt(range[0])+parseInt(range[1]))/2;
			}
		} 
		else {
			game.score[1] += game.goalValue[1][i];
		}
    } 
	else {
		game.score[0] += game.valueToTie;
		game.score[1] += game.valueToTie;
    }
	
    if(data[trailNumber].showOpponentProgress) {
		document.getElementById("YourScore").innerHTML = "Your score: " + game.score[0].toString();
		document.getElementById("OpponentScore").innerHTML = "Opponent score: " + game.score[1].toString();
	}
  }
}

/*	@function generatecards 
	A function to create the cards for the player using the card image and adding the functions for dragging.
*/
function generatecards(number) {
  var html = "";

  for (var i = 0; i < cards.count; i++) {
    cards.value[i] = 1;
    cards.image[i] = new Image();
    cards.image[i].src = game.cardImage;

    html +=
      '<img id="card' +
      i.toString() +
      '" src="' +
      cards.image[i].src +
      '" alt="" ' +
      ');" draggable="true" ondragstart="drag(event);" />';
    cards.playable[i] = false;
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
  if (game.hasPickedUp == -1) {
    game.hasPickedUp = index;
  }
  if (cards.playable[index] == false && game.hasPickedUp == index) {
    card.dataTransfer.setData("text", card.target.id);
  }

}

/*	@function allowDrop
	A function to determine if the card can be dropped targeted lane
	@param card, is the card object being dropped
*/
function allowDrop(card) {
  //Allows the card boxes to accept cards.
  if (cards.playable[index] == false && game.hasPickedUp == index) {
    var goal = card.target.parentNode.lastChild;
    var goalIndex = goal.id[goal.id.length - 1];
    var isPlayerbox = card.target.className === "box playerBox"; // Checks class name to determine if this is the players box
    if (game.goalOpen[0][goalIndex] && isPlayerbox) {
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
	A function that calls generateGoals and generatecards
*/
function start() {
	jatos.onLoad(timercount()); // starts timer
	
	//all the variables are set to their values bases on the trailNumber and int.js
	game = new Game();
	cards = new Cards();
	resultsdata = new Resultsdata();
	
	//build the page using the variables set above.
	generateGoals();
	generatecards(); 
	
	updateScore(); // needs to be called here to update the score of the intial state
}

/*	@function incrementScore
	A function to increment the score of a player at a particular goal. uses random number to 
	@param player, [0 or 1] to indicate what player the score is added to
	@param score, to increment progress by
	@param goalNumber, the goal index [int] to add points to.
	@return int, 1 if the score was added, 0 otherwise
*/
function incrementScore(player, scoreToAdd, goalNumber) {
	if(Math.random() <= game.probabilityOfProgress[player]) {
		game.progress[player][goalNumber] += scoreToAdd;
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
		document.getElementById("goal"+goalToIncrement).previousSibling.innerHTML += "<img src=" + game.cardImage + ">";
	}
}

/* 	@function endTurn
	A function called when the turn ends, checks if a card has been played. if it has then it calls the AI function if one is specified in the int.js
	then resets the turn unless the player has played all their cards in which case it calls endgame
*/
function endTurn(callback) {
  if (game.turnNumber < game.duration) {
    if (cardPlayed != true) {
		alert("Place a card"); //Error message if no card is placed, only needed if the end turn button can be pressed before a card has been placed
    } else {
		game.turnNumber++;
		
		added = incrementScore(0, cards.value[game.hasPickedUp], goalIndex);
		
		if(added == 0) { 
			document.getElementById("card"+game.hasPickedUp).src = "";
			document.getElementById("card"+game.hasPickedUp).draggable = false;
		}
	  
		if(data[trailNumber].opponent != "false") {
			window[data[trailNumber].opponent](1, 1);
		}
		
		updateScore();
	  
		//10-10-2019(Tony) pushes the progress of each player to result every turn- seems to be changing as the game goes on
		var player1progress = JSON.parse(JSON.stringify(game.progress[0]));
		var player2progress = JSON.parse(JSON.stringify(game.progress[1]));

		resultsdata.player1.push(player1progress);
		resultsdata.player2.push(player2progress);

		yourTurn = false;
		cards.playable[game.hasPickedUp] = true;
		cardPlayed = false;
		goalIndex = null;
		game.hasPickedUp = -1;
		document.getElementById("endTurn").className = "endTurnButton";

		if (game.turnNumber >= game.duration) {
		endgame(callback);
		}
    }
  }
}

/*	@function toggleResults
	A function to toggle the display status of the results div and game div.
	aswell as clearing the results innerhtml if the results are being toggled off.
	
*/
function toggleResults() {
	var results = document.getElementById("results");
	if(results.style.display == "block") {
		results.innerHTML = "";
		results.style.display = "none";
		document.getElementById("backgroundblur").style.display = "initial";
	}
	else {
		document.getElementById("backgroundblur").style.display = "none";
		results.style.display = "block";
	}
}

/*	@function endgame
	A function that is called when the game ends, it parses the results to JATOS and shows the results of the trail before calling the nextComponent
*/
function endgame(callback) {
  
	stoptimer();
	  
	resultsdata.trailendscore[0] = game.score[0];
	resultsdata.trailendscore[1] = game.score[1];

	console.log("player score: " + game.score[0]);
	console.log("opponent score: " + game.score[1]);
	  
	var results = document.getElementById("results");
	results.innerHTML =
		"<h1>RESULTS</h1><hr>" +
		"<p>You scored: " +
		game.score[0].toString() +
		".</p>" +
		"<p>Your opponent scored: " +
		game.score[1].toString() +
		".</p>";

	if (game.score[0] > game.score[1]) {
		results.innerHTML += "<h3>You won!</h3>";
	} else if (game.score[0] == game.score[1]) {
		results.innerHTML += "<h3>It's a draw!</h3>";
	} else {
		results.innerHTML += "<h3>You lost!</h3>";
	}

	toggleResults();
	
	jatos.appendResultData(resultsdata); //used to append results of this trail to the array of results of all trails
	trailNumber++;
	  
	if(trailNumber >= data.length) {
		setTimeout(jatos.startNextComponent, 3000); // starts the next component after waiting 3 seconds
	}
	else {
		callback();
		setTimeout(toggleResults, 3000);
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
