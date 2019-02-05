# Who wants to be a Script-ioner?
'__Who wants to be a Scrit-ioner?__' is a simple console application build with TypeScript, JavaScript, Node.js and MySQL. The main goal is to answer correct five questions. When the game starts a random question is selected from the database and the player should answer it by typing a number between 1 and 4 in the console. If the player gives a wrong answer, the games ends and the player loses the game.

# Requirements
* [Node.js](https://nodejs.org/en/)
* MySQL Database Server

# Installation
Go ahead and download the files or clone the repository. The first think you need to do is to run the MySQL dump file on your MySQL server. The file is located in `sql/db_dump.sql`. Then you need to put your hostname, username and password of your Database server (lines 9, 10 and 11 of `main.js`). To run the application simply run `node main.js` from the top directory. Once you run that command the game starts and the first questions will be asked.

# Project Description
The application walks through some simple steps - __Basic Configuration, The Essential Logic__
## Basic Configuration
Requires two libraries - readline (for reading from the command-prompt) and mysql (to work with the database). Then the connection is created with the selected hostname, username and password. The database name should stay the same because the `sql/db_dump.sql` file creates a database with that name. If an error appears it will be thrown. Then the application creates a readline instance with the standart input and standart output.

## The Essential Logic
The application makes a query to the database that fetches 5 randomly ordered rows. Then the function ask() is called (even though it is declared before the call is made). The function creates an array of four objects (containing information about every answer of the current question) with two properties each - answer: the answers themself and isCorrect: true or false, showing which one of the answers is correct. Then the suffle() function is called. It loops through the array and swaps every element with a randomly selected one. The currentQuestionStr variable is a string containing the current question and the corresponding answers. Then the method question() is called. It asks the player the question and waits for the input from the console. Then the answered is verified. A checkup is made weather the already answered question have reached 5. Just before the function ends, it calls itself. A recursion is made the next question is asked. The application has two possible exits - the game is lost or it was won. Both cases call the rl.close() and process.exit() method that close the readline instance and ends the whole process. 