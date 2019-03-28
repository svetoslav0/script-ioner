module.exports = function(app) {
    const questionsController = require('./appController');
    
    app.route('/start-new-game')
        .get(questionsController.startNewGame);

    app.route('/question-api')
        .get(questionsController.getRandomQuestion);
    
    app.route('/validate-answer/:answer')
        .get(questionsController.validateAnswer);

    app.route('*')
        .get((req, res) => {
            res.status(404);
            res.send("<h1>Are you lost?</h1><h3>Page not found, sorry . . .</h3>");
        })

}