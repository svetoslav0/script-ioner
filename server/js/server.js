"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var appRoutes_1 = require("./appRoutes");
var appController_1 = require("./appController");
var app = express_1.default();
var port = 5001;
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
var router = new appRoutes_1.Router(app, new appController_1.Controller());
router.route();
app.listen(port, function () {
    console.log("Listening on port " + port);
});
