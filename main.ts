const readline = require('readline');
const mysql = require('mysql');
const QUESTIONS_PER_GAME = 5;
const GAME_WON_COLOR_CODE = '\x1b[36m\x1b[47m%s\x1b[0m'; // Cyan text color with white bg
const CORRECT_ANSWER_COLOR_CODE = '\x1b[42m\x1b[33m%s\x1b[0m'; // Yellow text color with green bg
const WARNING_COLOR_CODE = '\x1b[33m%s\x1b[0m'; // Yellow text color
const WRONG_ANSER_COLOR_CODE = '\x1b[31m\x1b[47m%s\x1b[0m' // Red text color with white bg
const possibleAnswers = ['1', '2', '3', '4'];

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
            let currentAnswersAsObjs = answersObjectBuilder(rows);
            shuffle(currentAnswersAsObjs);

            // Adding an object with 'isCorrect' value '-1'
            // This value will be accessed if the given answer does not exist in 'possibleAnswers' array
            // This operation is done here, right after the shuffling so the added object will be to the last position for sure
            let invalidAnswer = { answer: null, isCorrect: -1 };
            currentAnswersAsObjs.push(invalidAnswer);
            
            // Building a string that will be shown on the screen as a question with possible answers
            let currentQuestionStr = questionStringBuilder(rows[questionCounter].question, currentAnswersAsObjs);

            // Ask each of the fetched questions
            rl.question(currentQuestionStr, (answer) => {
                
                questionCounter++;
                
                // Check if the given answer exists in the 'possibleAnswers' array
                // If not - a value with the last array's index will be given - the invalid one
                if (possibleAnswers.indexOf(answer) == -1) {
                    answer = possibleAnswers.length + 1;
                }
                
                let answered = currentAnswersAsObjs[answer - 1];
                
                // Validate the given answer is correct, if the value of 'isCorrect' is -1
                // That means the last object of the answers is accessed which means the given answer is not valid
                if (answered.isCorrect == -1) {
                    console.log(WARNING_COLOR_CODE, '\nInvalid answer!\nPlease type one of the following answers: ' + possibleAnswers.join(', ') + '\n');
                    questionCounter--;
                } else if (answered.isCorrect) {
                    console.log(CORRECT_ANSWER_COLOR_CODE, 'Correct!\n');
                } else {
                    console.log(WRONG_ANSER_COLOR_CODE, 'Wrong answer, sorry...\nBetter luck next time!');
                    rl.close();
                    process.exit();
                }

                // If the questionCounter reaches the certain number that means the game ends with no incorrect answers given
                if(questionCounter > QUESTIONS_PER_GAME - 1){
                    console.log(GAME_WON_COLOR_CODE, '\nYOU WON THE GAME!\nCONGRATULATIONS!');
                    rl.close();
                    process.exit();
                }
            // The functions calls itself
            ask();
        });
        }
    // This is where the function is called for the first time
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

function questionStringBuilder(question, answersObj){
    let str = question + '\n'
    str += '[1] ' + answersObj[0].answer + '\n';
    str += '[2] ' + answersObj[1].answer + '\n';
    str += '[3] ' + answersObj[2].answer + '\n';
    str += '[4] ' + answersObj[3].answer + '\n';
    str += 'Answer: ';
    return str;
}

function answersObjectBuilder(rows){
    return [
        {
            answer: rows[questionCounter].right_answer,
            isCorrect: 1
        },
        {
            answer: rows[questionCounter].wrong_answer_1,
            isCorrect: 0
        },
        {
            answer: rows[questionCounter].wrong_answer_2,
            isCorrect: 0
        },
        {
            answer: rows[questionCounter].wrong_answer_3,
            isCorrect: 0
        }
    ];
}