"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoRepository = /** @class */ (function () {
    function MongoRepository() {
    }
    MongoRepository.prototype.connect = function () {
        console.log('Ooops, I am not implemnted....!');
        throw new Error("Method not implemented.");
    };
    MongoRepository.prototype.fetchQuestions = function () {
        throw new Error("Method not implemented.");
    };
    MongoRepository.prototype.validate = function (answerId) {
        throw new Error("Method not implemented.");
    };
    return MongoRepository;
}());
exports.MongoRepository = MongoRepository;
