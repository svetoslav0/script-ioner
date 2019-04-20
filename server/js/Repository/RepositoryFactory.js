"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MysqlRepository_1 = require("./MysqlRepository");
var MongoRepository_1 = require("./MongoRepository");
var RepositoryFactory = /** @class */ (function () {
    function RepositoryFactory() {
    }
    RepositoryFactory.prototype.createRepository = function () {
        switch (process.env.DB_ADAPTER) {
            case "mysql":
                var mysql = new MysqlRepository_1.MysqlRepository();
                return mysql;
            case "mongo":
                var mongo = new MongoRepository_1.MongoRepository();
                return mongo;
            default:
                throw new Error("Invalid Repository type: " + process.env.DB_ADAPTER + ", please check the DB_ADAPTER property in '.env' or implement the new Repository");
        }
    };
    return RepositoryFactory;
}());
exports.RepositoryFactory = RepositoryFactory;
