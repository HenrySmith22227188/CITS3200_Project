//This file contains all the scripts necessary to run the functionality of the game.

var cardPlayed; 
var index;
var goalIndex;

var Game = {
    duration: data.numberOfCards, //The number of remaining turns in a trial.
    goalValue: data.goalValue, //An array holding one array for each player, which represents the value of each goal to that player.
    
    valueToTie: 0, //The value gained by each player in the result of a tie for any goal.
    probabilityOfProgress: data.probabilityOfProgress, //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
    progress: data.progress, //The progess made by each player towards each goal.
    
    //** The following can probably exist outside of the Game object, since we don't need to report them? **
    goalOpen: data.goalOpen, //The completedness of the goals.
    score: data.score, //The total score for each player.
	turnNumber: 0, // The turn number, initialised to 1. Increment during gameplay
	//mtno: 10, //The maximum number of turns
    // **Do something like this, too**
    //PlayerCard: [new Cards(), new Cards()]
};

var Cards = {
	count: data.numberOfCards, //The number of cards avaliable to each player at start of game
	value:  new Array(), //An array to hold the value of each card
	image:	new Array(), //An array to hold the image for each card corresponding to its value
    playable:  new Array() //An array to hold if the card is playable
}

Game.numberOfGoals = [Game.goalValue[0].length, Game.goalValue[1].length]; //An array holding the number of goals available for each player.

function generateGoals() //A function to add HTML corresponding to the amount of goals (which is defined in the value for G in the Game object).
{
    var html = '';
    var numberOfGoals = Game.numberOfGoals[0];
    for(var i=0; i<numberOfGoals; i++) //Adds G goals for each player.
    {
        var ii = i.toString(); //To be inserted into the HTML to find the right goals.

        html += '<div><div class="player value"><h1>' + Game.goalValue[0][i].toString() + '</h1></div><div class="opponent value"><h1>' + Game.goalValue[1][i].toString() + '</h1></div><div class="box playerBox" ondrop="drop(event);" ondragover="allowDrop(event);"></div><div class="box opponentBox" ondrop="drop(event);" ondragover="allowDrop(event);"></div><div class="goal" id="goal' + ii + '"><div class="left score"><h3 id="score' + ii + '">'+(Game.progress[0][i]).toString() + '</h3></div><div class="right score"><h3>' + (Game.progress[1][i]).toString() + '</h3></div></div></div>';
        
        document.getElementById('goals').innerHTML = html;
    }
}

function updateGoals()
{
    for(var i=0; i<Game.numberOfGoals[0]; i++){
        document.getElementById("score"+i.toString()).innerHTML = Game.progress[0][i];
        if(!Game.goalOpen[0][i]) //Recognises when a goal is Open
        {
            Game.goalOpen[0][i] = false;
            Game.score[0] += Game.goalValue[0][i];
            document.getElementById('YourScore').innerHTML = 'Your score: ' + (Game.score[0]).toString();
        }
    }
}

function generateCards(number) {
	var html = '';
	//for (var player in cards) {
		//insert card placeholder for each player
		for (var i = 0; i<Cards.count; i++) {
			Cards.value[i] = 10;
			Cards.image[i] = new Image();
			Cards.image[i].src = 'https://cdn.pixabay.com/photo/2015/08/11/11/57/spades-884197_960_720.png'; //Will need to update code so as to allow different types of cards to become sourced
		
            html += '<img id="card' + i.toString() + '" src="' + Cards.image[i].src + '" alt="" onclick="selectCard(card'+i.toString()+');" draggable="true" ondragstart="drag(event);" />';
            Cards.playable[i] = false;
        }
      document.getElementById('cards').innerHTML = html; //Inserts the above HTML into the 'cards' div.
	//}
}

function drag(card) //Collects the ID of the card as it begins to get dragged.
{
    //if(!cardPlayed) TODO make this not block the one card from being moved before the turn has ended.
    //{
        index = parseInt(card.target.id[(card.target.id).length - 1]);
        if(Cards.playable[index]==false)
        {
            card.dataTransfer.setData("text", card.target.id);
        }
    //}
}

function allowDrop(card) //Allows the card boxes to accept cards.
{
    // TODO prevent players from placing cards in each others lanes
	var goal = card.target.parentNode.lastChild;
    var goalIndex = goal.id[goal.id.length-1];
    card.preventDefault();

}

function drop(card) //Once the card has been dropped to a valid box, it moves that node to its new parent.
{
    card.preventDefault();
    var data = card.dataTransfer.getData("text"); //Gets the ID of card from the drag(card) function.
    if(data != '')
    {
        index = data[data.length - 1];
        var goal = card.target.parentNode.lastChild.id; //Retrieves the ID of the goal it was dragged to.
        goalIndex = parseInt(goal[goal.length - 1]); //Extracts the goal number from its ID.
        card.target.appendChild(document.getElementById(data)); //Moves the dragged card to the box in which it was dropped.
    }
    cardPlayed = true;
}

// DROP FUCNTION for CARD STARTING ROW:
// - end with cardPlayed = false

function start() {
	generateGoals();
	generateCards();
}

function incrementScore(player, scoreToAdd, goalNumber) //A function to increment the score of a player at a particular goal. p = player [0 or 1], n = score to increment by [int], g = the goal [int] to add points to.
{
    if(Game.goalOpen[player][goalNumber]) //Only open goals can have cards allocated to them.
    {
        Game.progress[player][goalNumber] += scoreToAdd;
        updateGoals();
    }
}

function selectCard(cardID) //A function to run when a card is selected.
{
    document.getElementById(cardID).className = 'selected';
}

function endTurn()
{
	if(Game.turnNumber < Game.duration) {
		if(goalIndex == null)
		{
			alert("Place a card"); //Error message goes here
		}
		else 
		{
			Game.turnNumber++;
            console.log("Turn: "+Game.turnNumber);
            console.log("Duration: "+Game.duration);
			if(Game.turnNumber >= Game.duration)
			{
				alert("Game Over");
			}
			incrementScore(0, 1, goalIndex);
			//TO DO: Make that function call have variable parameters.
			
			yourTurn = false;
			Cards.playable[index] = true;
			cardPlayed = false;
			goalIndex = null;
		}
	}	
}
