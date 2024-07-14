require('dotenv').config();

const serverless = require("serverless-http");
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const { default: mongoose } = require('mongoose');
const { execute } = require('./Utils/scheduler');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',(error)=>{console.log(error)});
db.once('open',()=>{console.log('Connected to database')})

const userRoutes = require('./users');

app.use(express.json());
router.use('/users', userRoutes);
app.use('/.netlify/functions/server', router);
setInterval(execute, 3 * 60 * 60 * 1000);
//execute();
module.exports.handler = serverless(app);
