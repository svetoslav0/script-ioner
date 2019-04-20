"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var body_parser_1 = __importDefault(require("body-parser"));
var appController_1 = require("./appController");
var RepositoryFactory_1 = require("./Repository/RepositoryFactory");
var app = express_1.default();
var port = +(process.env.PORT || 5001);
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
var server = app.listen(port, function () {
    console.log("Listening on port " + port);
});
var socket = socket_io_1.default(server);
var factory = new RepositoryFactory_1.RepositoryFactory();
var controller = new appController_1.Controller(factory, socket);
controller.run();
