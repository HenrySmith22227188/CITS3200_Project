//This file contains all the scripts necessary to run the functionality of the game.

var cardPlayed;
var index;
var goalIndex;
var Result;
var interval;

jatos.onLoad(timercount());

var Game = {
  hasPickedUp: -1, //indicator as to if the player has placed a card, if they have the value is the id of the card else its value is -1.
  duration: data.numberOfCards, //The number of remaining turns in a trial.
  goalValue: data.goalValue, //An array holding one array for each player, which represents the value of each goal to that player.
  numberOfGoals: data.goalValue[0].length,

  valueToTie: 0, //The value gained by each player in the result of a tie for any goal.
  probabilityOfProgress: data.probabilityOfProgress, //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
  progress: data.progress, //The progress made by each player towards each goal.

  //** The following can probably exist outside of the Game object, since we don't need to report them? **
  goalOpen: data.goalOpen, //The completedness of the goals.
  score: [0, 0], //The total score for each player.
  turnNumber: 0, // The turn number, initialised to 0. Increment during gameplay
  cardImage:
    "https://cdn.pixabay.com/photo/2015/08/11/11/57/spades-884197_960_720.png"
  //PlayerCard: [new Cards(), new Cards()]
};

var Cards = {
  count: data.numberOfCards, //The number of cards avaliable to each player at start of game
  value: new Array(), //An array to hold the value of each card
  image: new Array(), //An array to hold the image for each card corresponding to its value
  playable: new Array() //An array to hold if the card is playable
};

function stoptimer() {
  clearInterval(interval);
}

function timercount() {
  interval = setInterval(function() {
    resultsdata.timespent++;
  }, 1000);
}

var resultsdata = {
	numberOfCards: Cards.count, 
	goalValue: Game.goalValue, 
	numberOfGoals: Game.numberOfGoals,
	player1: new Array(),
	player2: new Array(),
	timespent: 0,
	trailendscore: new Array()
};

function generateGoals() {
  //A function to add HTML corresponding to the amount of goals (which is defined in the value for G in the Game object).
  var html = "";
  
  for (var i = 0; i < Game.numberOfGoals; i++) {
    var ii = i.toString(); //To be inserted into the HTML to find the right goals.

    var imagesProgressPlayer = "";
    var imagesProgressOpponent = "";

    for (var j = 0; j < Game.progress[0][i]; j++) {
      imagesProgressPlayer += "<img src=" + Game.cardImage + ">";
    }
    for (var j = 0; j < Game.progress[1][i]; j++) {
      imagesProgressOpponent += "<img src=" + Game.cardImage + ">";
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
      Game.progress[1][i].toString() +
      "</h3></div></div></div>";

    document.getElementById("goals").innerHTML = html;
  }
}

function updateScore() {
  // A function to calculate the score, it also updates the progress displayed in the middle of the board
  Game.score = [0, 0];
  for (var i = 0; i < Game.numberOfGoals; i++) {
    document.getElementById("score0_" + i.toString()).innerHTML =
      Game.progress[0][i];
	document.getElementById("score1_" + i.toString()).innerHTML =
      Game.progress[1][i];

    if (Game.progress[1][i] < Game.progress[0][i]) {
      Game.score[0] += Game.goalValue[0][i];

    } else if (Game.progress[1][i] > Game.progress[0][i]) {
      Game.score[1] += Game.goalValue[1][i];

    } else {
      Game.score[0] += Game.valueToTie;
      Game.score[1] += Game.valueToTie;
    }
	
    document.getElementById("YourScore").innerHTML =
      "Your score: " + Game.score[0].toString();
    document.getElementById("OpponentScore").innerHTML =
      "Opponent score: " + Game.score[1].toString();
  }
}

function generateCards(number) {
  var html = "";
  //insert card placeholder for each player
  for (var i = 0; i < Cards.count; i++) {
    Cards.value[i] = 1;
    Cards.image[i] = new Image();
    Cards.image[i].src = Game.cardImage;

    html +=
      '<img id="card' +
      i.toString() +
      '" src="' +
      Cards.image[i].src +
      '" alt="" onclick="selectCard(card' +
      i.toString() +
      ');" draggable="true" ondragstart="drag(event);" />';
    Cards.playable[i] = false;
  }
  document.getElementById("cards").innerHTML = html; //Inserts the above HTML into the 'cards' div.
  //}
}

function drag(card) {
  //Collects the ID of the card as it begins to get dragged.
  index = parseInt(card.target.id[card.target.id.length - 1]);
  if (Game.hasPickedUp == -1) {
    Game.hasPickedUp = index;
  }
  if (Cards.playable[index] == false && Game.hasPickedUp == index) {
    card.dataTransfer.setData("text", card.target.id);
  }
  //}
}

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

function drop(card) {
  //Once the card has been dropped to a valid box, it moves that node to its new parent.
  card.preventDefault();
  var data = card.dataTransfer.getData("text"); //Gets the ID of card from the drag(card) function.
  if (data != "") {
    index = data[data.length - 1];
    var goal = card.target.parentNode.lastChild.id; //Retrieves the ID of the goal it was dragged to.
    goalIndex = parseInt(goal[goal.length - 1]); //Extracts the goal number from its ID.
    card.target.appendChild(document.getElementById(data)); //Moves the dragged card to the box in which it was dropped.
  }
  cardPlayed = true;
  document.getElementById("endTurn").className = "endTurnButton ready";
}

function start() {
  generateGoals();
  generateCards();
}

function incrementScore(player, scoreToAdd, goalNumber) {
  //A function to increment the score of a player at a particular goal. p = player [0 or 1], n = score to increment by [int], g = the goal [int] to add points to.
  if (Game.goalOpen[player][goalNumber]) {
    //Only open goals can have cards allocated to them.
    Game.progress[player][goalNumber] += scoreToAdd;
  }
}

function selectCard(cardID) {
  //A function to run when a card is selected.
  document.getElementById(cardID).className = "selected";
}

// Example function to show how you can make Opponents that dynamically add cards
function mirrorOpponent() {
	incrementOpponent(goalIndex, 1);
}

// Function incrementOpponent, increases progress by scoreToAdd in the Opponents lane for the goalToIncrement lane.
function incrementOpponent(goalToIncrement, scoreToAdd) {
	Game.progress[1][goalToIncrement] += scoreToAdd;
	for(var i = 0; i < scoreToAdd; i++) {
		document.getElementById("goal"+goalToIncrement).previousSibling.innerHTML += "<img src=" + Game.cardImage + ">";
	}
}

function endTurn() {
  if (Game.turnNumber < Game.duration) {
    if (goalIndex == null) {
      alert("Place a card"); //Error message if no card is placed
    } else {
      Game.turnNumber++;
	  
      console.log("Turn: " + Game.turnNumber);
      console.log("Duration: " + Game.duration);
      incrementScore(0, 1, goalIndex);
	  if(data.opponent != "false") {
		  window[data.opponent](1, 1);
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
        
		stoptimer();
        endGame();
		
      }
    }
  }
}

function endGame() {
  
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
  jatos.startNextComponent(); // starts the next component
 

}

// function that triggers the overlay when the help button is depressed.
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
