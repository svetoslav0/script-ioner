const mysql = require('./db');

const Question = (question) => {
    this.id = question.id;
    this.question = question.question;
    
    this.answer1 = question.right_answer;
    this.answer2 = question.wrong_answer_1;
    this.answer3 = question.wrong_answer_2;
    this.answer4 = question.wrong_answer_3;
    
    return this;
}

Question.getQuestion = (result) => {
    return new Promise((resolve, reject) => {
        const limit = 1;
        const query = `SELECT id, question, right_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3 FROM questions ORDER BY RAND() LIMIT ${limit}`;

        mysql.query(query, (err, res) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
                resolve();
            } else {
                result(null, res);
            }
        });
    })
}

Question.totalQuestionsCount = (result) => {
    const query = `SELECT COUNT(*) as count FROM questions`;

    mysql.query(query, (err, res) => {
        if (err) {
            console.log('Error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

module.exports = Question;