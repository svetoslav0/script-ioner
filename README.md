# Who wants to be a Script-ioner?
'__Who wants to be a Script-ioner?__' is a simple web-based application build with TypeScript, JavaScript, Node.js, ExpressJS, Angular and MySQL. The main goal is to answer several questions correctly. When the game starts a random question is selected from the database and the player should answer it. If the player gives a wrong answer, the game ends and the player loses the game.

# Requirements
* Web Server (such as [Apache](https://httpd.apache.org/))
* [Node.js](https://nodejs.org/en/)
* MySQL Database Server

# Installation
Go ahead and download the files or clone the repository. The first thing you need to do is to run the MySQL dump file on your MySQL server. The file is located in the root directory. Then you need to type your hostname, username and password of your Database server (located in `server\js\.env`). To run the application you need to fire the server from the `server\js` folder by running `node server.js` command. The you need to run the web server and if everything is okay, the web server should connect to the application server. Once it does the game starts and the first question appears.