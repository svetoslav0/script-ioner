const Question = require('./appModel');
const answersShuffle = require('./answersShuffle');

let rightAnswer = "";
let askedQuestionsIds = [];

exports.startNewGame = (req, res) => {
    askedQuestionsIds = [];
    res.send({newGameStarted: true});
}

exports.getRandomQuestion = (req, res) => {
    getQuestionsCount().then((c) => {

        (function fetch() {
            Question.getQuestion((err, question) => {
                if(err) {
                    res.send(err);
                }
                console.log('Data accessed');
                
                let currentQuestion = Question(question[0]);

                console.log(currentQuestion);
                
                if (!askedQuestionsIds.includes(currentQuestion.id)) {
                    askedQuestionsIds.push(currentQuestion.id);
                    included = true;
                    console.log(askedQuestionsIds.sort());

                    rightAnswer = currentQuestion.answer1;

                    let shuffledAnswers = answersShuffle([
                        currentQuestion.answer1,
                        currentQuestion.answer2,
                        currentQuestion.answer3,
                        currentQuestion.answer4
                    ]);

                    currentQuestion.answer1 = shuffledAnswers[0];
                    currentQuestion.answer2 = shuffledAnswers[1];
                    currentQuestion.answer3 = shuffledAnswers[2];
                    currentQuestion.answer4 = shuffledAnswers[3];
                    
                    res.send(currentQuestion);
                } else {
                    if (askedQuestionsIds.length >= c){
                        res.send({noMoreQuestions: true});
                    } else {
                        fetch();
                    }
                }
            });
        })();
    });
}

function getQuestionsCount() {
    return new Promise((resolve, reject) => {
        Question.totalQuestionsCount((err, count) => {
            if (err) {
                console.log(err);
            }

            resolve(+count[0].count);
        })
    });
}

exports.validateAnswer = (req, res) => {
    let answer = decodeURIComponent(req.params.answer);
    if(rightAnswer == answer) {
        res.send({ isCorrect: true });
    } else {
        res.send({
            isCorrect: false,
            rightAnswer
        });
    }
}