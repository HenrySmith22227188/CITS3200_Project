//This file contains all the scripts necessary to run the functionality of the game.

var Game = {
    D: 3, //The number of remaining turns in a trial.
    V: [[10,8,5,3],[10,8,5,3]], //An array holding another array for each player, which represents the value of each goal to that player.
    
    //** G is functionally dependent on V[]? **
    
    Vtie: 5, //The value gained by each player in the result of a tie for any goal.
    a: [0.9, 0.9], //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
    S: [[1,3,5,4],[2,6,0,2]] //The progess made by each player towards each goal.
};

Game.G = [Game.V[0].length, Game.V[1].length]; //An array holding the number of goals available for each player.

function generateGoals(G)
{
    html = "";
    for(i=0; i<G; i++) //Adds G goals for each player.
    {
        document.getElementById('goals').innerHTML += '<div class="goal"><div class="left score"><h3 id="score' + i.toString() + '">'+(Game.S[0][i]).toString() + '</h3></div><div class="right score"><h3>' + (Game.S[1][i]).toString() + '</h3></div><h1>' + Game.V[0][i] + '</h1></div>';
    }
}
