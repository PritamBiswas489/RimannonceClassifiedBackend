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
// import ffmpeg from 'fluent-ffmpeg';
 


 

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
app.get('/share/:id', (req, res, next) => {
	const payload = { ...req.params, ...req.query, ...req.body };
	const id = payload?.id;
	res.redirect(`rimannonceclassifiedapp://announcement/details/${id}`) 
});

// app.get('/fluent-ffmpeg-test', (req, res, next) => {
// 	const inputVideo = '/upload-announcement-files/videos_4-1706269758766-784760595.mp4';
// 	const outputImage = 'output.jpg';

// 	ffmpeg(inputVideo)
// 	.output('screenshot.png')
// 	.noAudio()
// 	.seek('3:00')
  
	 
// 	.on('error', function(err) {
// 	  console.log('An error occurred: ' + err.message);

// 	  res.send({ msg: err.message });
// 	})
// 	.on('end', function() {
	   
// 	  res.send({ msg: 'Processing finished !' });
// 	})
// 	.run();

	
// })

 

app.use('/uploads', express.static('uploads'));
app.use('/upload-announcement-files', express.static('upload-announcement-files'));

app.use('/api', apiRouter);

export default app;
