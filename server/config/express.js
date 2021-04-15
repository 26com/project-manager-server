import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import router from '../routes/index.js';
import configs from '../config/index.js';
import errorHandler from '../utils/middlewareErrorsCatcher.js';

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

export default app;



