//This file contains all the scripts necessary to run the functionality of the game.

var Game = {
    G: [0,0]; //An array holding the number of goals available for each player.
    //** Functionally dependent on V[]? **
    D: 3; //The number of remaining turns in a trial.
    V: [[],[]]; //An array holding another array for each player, which represents the value of each goal to that player.
    Vtie: 5; //The value gained by each player in the result of a tie for any goal.
    a: [0.9, 0.9]; //The likelihood of making progess towards a goal (i.e. of the card not disintegrating) for each player.
    
    S: [[],[]]; //The progess made by each player towards each goal.
}

