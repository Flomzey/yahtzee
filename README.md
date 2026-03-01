# YAHTZEE | Dice Poker
My friends and I like to play Yahtzee when we meet, often times our table is to small or giving each other the dice is annoying and exhausting.

This webapp aims to solve this problem.

Firstly this app will have a host client, that shows current point standings and shows a QR-Code that lets players log into the hosts game.

Secondly this app will have a player client, that lets the player throw their dice and lets them enter their points.

The player scores will be stored server side, as a single-source of truth, which will make cheating not easily possible.

## Current Standings:

I finished the Frontend right now playing is possible, but there are no rounds and no multiplayer.
But the data is caluclated entirely on the backend.

Here is a picture of the finished Frontend:

<img width="856" height="1482" alt="image" src="https://github.com/user-attachments/assets/c4c7bfac-05f5-4174-85f0-052d7c8cd805" />

It is possible to roll, select, and save the die/score, the score is added up and the bonus is calculated.

The game is basically playable alone, though right now the player has an infinite amount of rolls (good for testing => bad for playing).

## What I am doing right now:

I'm currently working on finishing the back-end playing-flow, so the game becomes actually playable.

## Future Thoughts:

While programming this I was very annoyed by the fact that JavaScript is a horrible language for me, It took me long enough
to get comfortable with having no-forced types.

In the future I am planning to migrate the backend to Java, and the frontend to TypeScript, I did not yet decide the Frameworks though.

### Special Thanks:

This Project uses a modified version of the BoldPixels font by YukiPixels thanks for contributing to my project!
