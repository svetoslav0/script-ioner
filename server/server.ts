require('dotenv').config();

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import { Router } from './appRoutes';
import { Controller } from './appController';

const app: express.Application = express();
const port: number = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = new Router(app, new Controller());
router.route();

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});