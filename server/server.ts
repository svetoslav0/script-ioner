import dotenv from "dotenv";
dotenv.config({});

import cors from "cors";
import express from "express";
import socketio from "socket.io";
import bodyParser from "body-parser";

import { Controller } from './appController';
import { RepositoryFactory } from "./Repository/RepositoryFactory";

const app: express.Application = express();
const port: number = +(process.env.PORT || 5001);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const socket: socketio.Server = socketio(server);

const factory: RepositoryFactory = new RepositoryFactory();
const controller: Controller = new Controller(factory, socket);

controller.run();