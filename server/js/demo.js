"use strict";
// This file is created for test purpose
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var adapter = "mysql";
Promise.resolve().then(function () { return __importStar(require(adapter)); }).then(function (db) {
    var database = db.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'scriptioner'
    }).connect();
    console.log(database);
});
