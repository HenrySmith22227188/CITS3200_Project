//This file contains all the scripts necessary to run the functionality of the game.

var Game = {
    D: 3, //The number of remaining turns in a trial.
    V: [[10,8,5,3],[10,8,5,3]], //An array holding another array for each player, which represents the value of each goal to that player.
    
    //** G is functionally dependent on V[]? **
    
    Vtie: 5, //The value gained by each player in the result of a tie for any goal.
    a: [0.9, 0.9], //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
    S: [[4,3,2,1],[2,6,0,2]], //The progess made by each player towards each goal.
    
    //** The following can probably exist outside of the Game object, since we don't need to report them? **
    GoalOpen: [true, true, true, true], //The completedness of the goals.
    T: [0,0] //The total score for each player.
};

Game.G = [Game.V[0].length, Game.V[1].length]; //An array holding the number of goals available for each player.

function generateGoals() //A function to add HTML corresponding to the amount of goals (which is defined in the value for G in the Game object).
{
    html = '';
    G = Game.G[0];
    for(i=0; i<G; i++) //Adds G goals for each player.
    {
        ii = i.toString(); //To be inserted into the HTML to find the right goals.
        
        if((Game.S[0][i] >= Game.V[0][i])&&(Game.GoalOpen[i])) //Recognises when a player has reached the value for a goal.
        {
            //document.getElementById('goal' + ii).className += ' completed';
            Game.GoalOpen[i] = false;
            Game.T[0] += Game.V[0][i];
            document.getElementById('YourScore').innerHTML = 'Your score: ' + (Game.T[0]).toString();
        }
        
        if(!(Game.GoalOpen[i]))
        {
            extraClass = ' completed';
        } else {
            extraClass = '';
        }
        
        html += '<div class="goal' + extraClass + '" id="goal' + ii + '"><div class="left score" onclick="incrementScore(0,1,' + ii + ')"><h3 id="score' + ii + '">'+(Game.S[0][i]).toString() + '</h3></div><div class="right score"><h3>' + (Game.S[1][i]).toString() + '</h3></div><h1>' + Game.V[0][i] + '</h1></div>';
        
        document.getElementById('goals').innerHTML = html;
    }
}

function incrementScore(p, n, g) //A function to increment the score of a player at a particular goal. p = player [0 or 1], n = score to increment by [int], g = the goal [int] to add points to.
{
    if(Game.GoalOpen[g]) //Only open goals can have cards allocated to them.
    {
        Game.S[p][g] += n;
        generateGoals();
    }
}

function selectCard(cardID) //A function to run when a card is selected.
{
    document.getElementById(cardID).className = 'selected';
}
