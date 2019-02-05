const readline = require('readline');
const mysql = require('mysql');
const QUESTIONS_PER_GAME = 5;
const GAME_WON_COLOR_CODE = '\x1b[36m\x1b[47m%s\x1b[0m'; // Cyan text color with white bg
const CORRECT_ANSWER_COLOR_CODE = '\x1b[42m\x1b[33m%s\x1b[0m'; // Yellow text color with green bg
const WRONG_ANSER_COLOR_CODE = '\x1b[31m\x1b[47m%s\x1b[0m' // Red text color with white bg

// Create MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'scriptioner'
});

connection.connect((err) => {
    if (err) {
        throw err;
    } 
});

// Create new readline.Interface instance
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let questionCounter = 0;

// Select 'QUESTION_PER_GAME' random questions from db
connection.query('SELECT * FROM questions ORDER BY RAND() LIMIT ' + QUESTIONS_PER_GAME, (err,rows) => {
    if(err){
        throw err;
    } 
        function ask() {
            let currentQuestionObj = [
                {
                    answer: rows[questionCounter].right_answer,
                    isCorrect: true
                },
                {
                    answer: rows[questionCounter].wrong_answer_1,
                    isCorrect: false
                },
                {
                    answer: rows[questionCounter].wrong_answer_2,
                    isCorrect: false
                },
                {
                    answer: rows[questionCounter].wrong_answer_3,
                    isCorrect: false
                }
            ];
            shuffle(currentQuestionObj);
            
            let currentQuestionStr = rows[questionCounter].question + '\n'
            currentQuestionStr += '[1]' + currentQuestionObj[0].answer + '\n';
            currentQuestionStr += '[2]' + currentQuestionObj[1].answer + '\n';
            currentQuestionStr += '[3]' + currentQuestionObj[2].answer + '\n';
            currentQuestionStr += '[4]' + currentQuestionObj[3].answer + '\n';
            currentQuestionStr += 'Answer: ' + '\n';

            // Ask each of the fetched questions
            rl.question(currentQuestionStr, (answer) => {
                questionCounter++;
                if(questionCounter > QUESTIONS_PER_GAME - 1){
                    console.log(GAME_WON_COLOR_CODE, '\nYOU WON THE GAME!\nCONGRATULATIONS!');
                    rl.close();
                    process.exit();
                }

                // Check if the given answer is correct
                let answered = currentQuestionObj[answer - 1];
                if(answered.isCorrect) {
                    console.log(CORRECT_ANSWER_COLOR_CODE, 'Correct!\n');
                } else {
                    console.log(WRONG_ANSER_COLOR_CODE, 'Wrong answer, sorry...\nBetter luck next time!');
                    rl.close();
                    process.exit();
                }
            ask();
        });
        }
    ask();
});

// 'Shuffle' function that shuffles array's values
function shuffle(arr) {
    let j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}