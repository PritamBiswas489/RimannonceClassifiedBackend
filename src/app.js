import './config/environment.js';
import express, { Router, json, urlencoded } from 'express';
import compression from 'compression';
import cors from 'cors';
import { resolve as pathResolve, dirname, join as pathJoin, sep } from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { default as apiRouter } from './routes/index.router.js';
import customReturn from './middlewares/responseBuilder.js';
import { deleteExistingAvatar } from './libraries/utility.js';
 


 

const { NODE_ENV } = process.env;

const publicDir = NODE_ENV === 'development' ? pathResolve(pathJoin(dirname('./'), 'public')) : pathResolve(pathJoin(dirname('./'), '..', 'public'));

const app = express();
app.use(
	cors({
		exposedHeaders: ['accesstoken', 'refreshtoken'],
	})
);
app.use(compression());
app.use(helmet());
// app.use(json());
// app.use(urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));
app.use(express.static(publicDir));
app.use(customReturn);
app.get('/test', (req, res, next) => {
	console.log('process.env.NODE_ENV :>> ', process.env.NODE_ENV);
	res.send({ msg: 'server working' });
});

 

app.use('/uploads', express.static('uploads'));

app.use('/api', apiRouter);

export default app;
