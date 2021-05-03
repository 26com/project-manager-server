console.log('express config');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {router} = require('../routes/index');
const {configs} = require('../config/index');
const {errorHandler} = require('../utils/errorHandler');

const app = express();

//body parcer
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cookie parser
app.use(cookieParser(configs.secretKey));

//cors policy
app.use(cors());

//routes
app.use(router);

//catch an error
app.use(errorHandler);

module.exports = {
    app
};



