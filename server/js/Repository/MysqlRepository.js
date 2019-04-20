"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var MysqlRepository = /** @class */ (function () {
    function MysqlRepository() {
    }
    MysqlRepository.prototype.connect = function () {
        this.connection = mysql_1.default.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });
        this.connection.connect(function (err) {
            if (err) {
                console.log(err);
            }
        });
    };
    MysqlRepository.prototype.fetchQuestions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect();
            var questionsToFetch = +(process.env.QUESTIONS || 0);
            var query = "SELECT subq.id AS questionId, a.id AS answerId, subq.question, answer \n                FROM (SELECT id, question \n                        FROM questions ORDER BY RAND() LIMIT " + questionsToFetch + ") AS subq \n                INNER JOIN answers AS a ON a.questionId=subq.id";
            _this.connection.query(query, function (err, rows) {
                if (err) {
                    throw err;
                }
                resolve(rows);
            });
        });
    };
    MysqlRepository.prototype.fetchQuestionsWithCorrectAnswers = function (questionIds) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect();
            var condidionBuilder = "questionId = " + questionIds.join(' OR questionId = ');
            var query = "SELECT subq.id AS questionId, a.id AS answerId, subq.question, answer, isCorrect \n                        FROM (SELECT id, question FROM questions) AS subq \n                        INNER JOIN answers AS a ON a.questionId=subq.id\n                        WHERE " + condidionBuilder;
            _this.connection.query(query, function (err, rows) {
                if (err) {
                    throw err;
                }
                resolve(rows);
            });
        });
    };
    MysqlRepository.prototype.validate = function (answerId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect();
            var query = "SELECT isCorrect FROM answers WHERE id = " + answerId;
            _this.connection.query(query, function (err, rows) {
                if (err) {
                    throw err;
                }
                if (+rows[0].isCorrect == 1) {
                    resolve({ isCorrect: true });
                }
                else {
                    resolve({ isCorrect: false });
                }
            });
        });
    };
    return MysqlRepository;
}());
exports.MysqlRepository = MysqlRepository;
