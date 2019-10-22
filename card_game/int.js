// the javascript here defines most of the variables for the trials with the array, data
// each index of the array, data is a trial of the experiment
// such that data[0] is all the variables for the first trial.
// the game will keep running trials till it gets to the end of the array, data.
// if the varaibles are undefined the game will crash. or have unexpected behaviour.
// most of the variables have their equivalent in the game or card objects
// numberOfCards is also used to set the duration of the trial.
{
	data = [{
		"goalValue": [
			[10,8,5,3],
			[10,8,5,3]
		],
		"progress": [
			[0,0,0,0],
			[0,0,0,0]
		],
		"goalOpen": [
			[true, true, true, true],
			[true, true, true, true]
		],
		"numberOfCards": 4,
		"probabilityOfProgress": [1, 1],
		"showOpponentProgress": true,
		"opponent": "smartAI"
	},
	{
		"goalValue": [
			[10,8,5,3],
			[10,8,5,3]
		],
		"progress": [
			[0,0,0,0],
			[0,0,0,0]
		],
		"goalOpen": [
			[true, true, true, true],
			[true, true, true, true]
		],
		"numberOfCards": 4,
		"probabilityOfProgress": [0.5, 1],
		"showOpponentProgress": true,
		"opponent": "randomAI"
	},
	{
		"goalValue": [
			[10,8,5,3],
			[10,8,5,3]
		],
		"progress": [
			[0,0,0,0],
			[1,2,0,0]
		],
		"goalOpen": [
			[true, true, true, true],
			[true, true, true, true]
		],
		"numberOfCards": 4,
		"probabilityOfProgress": [1, 1],
		"showOpponentProgress": false,
		"opponent": "mirrorOpponent"
	},
	{
		"goalValue": [
			["6-9",8,5,3],
			[10,"8-10",5,3]
		],
		"progress": [
			[0,0,0,0],
			[0,0,0,0]
		],
		"goalOpen": [
			[true, true, true, true],
			[true, true, true, true]
		],
		"numberOfCards": 4,
		"probabilityOfProgress": [1, 1],
		"showOpponentProgress": true,
		"opponent": "smartAI"
	}]
}