const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./appRoutes');
routes(app);


app.listen(port, () => console.log(`Listening on port ${port}`));