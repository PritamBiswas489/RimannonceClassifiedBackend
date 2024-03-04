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
import ffmpeg from 'fluent-ffmpeg';
import { isMOVFile } from './libraries/utility.js';
import { processMovConvertProcess } from './services/videoencoding.service.js'; 
 
 
 


 

const { NODE_ENV } = process.env;

const publicDir = NODE_ENV === 'development' ? pathResolve(pathJoin(dirname('./'), 'public')) : pathResolve(pathJoin(dirname('./'), '..', 'public'));

const app = express();
app.use(
	cors({
		origin: '*',
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
	res.send({ msg: process.env.NODE_ENV });
});
app.get('/share/:id', (req, res, next) => {
	const payload = { ...req.params, ...req.query, ...req.body };
	const id = payload?.id;
	res.redirect(`rimannonceclassifiedapp://announcement/details/${id}`) 
});

app.get('/fluent-ffmpeg-test', (req, res, next) => {
	   const inputFile  = `${publicDir}/IMG_3715.MOV`
		// Output file path (.mp4)
		const outputFile = `${publicDir}/output.mp4`;
		// Convert .mov to .mp4
		ffmpeg(inputFile)
			.outputOptions('-c:v', 'libx264')
			.on('error', function(err) {
				console.error('Error occurred: ' + err.message);
				res.send({ msg: 'Error occurred: ' + err.message });
			})
			.on('end', function() {
				console.log('Conversion finished');
				res.send({ msg: 'Conversion finished' });
			})
			.save(outputFile);
			 
})
app.get('/convert-mov-mpfour-process',async (req, res, next) => {
	const response = await processMovConvertProcess()
	res.send(response)
})

app.get('/checking-is-mov-file',async (req, res, next) => {
	const fileOne  = `${publicDir}/IMG_3715.MOV`
	const fileTwo  = `${publicDir}/output.mp4`

	res.send({ file1: await isMOVFile(fileOne), file2: await isMOVFile(fileTwo) });
})

 
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.header("Cross-Origin-Resource-Policy", "cross-origin")
	next();
  })


 
 
app.use('/uploads', express.static('uploads'));
 
app.use('/upload-announcement-files', express.static('upload-announcement-files'));

app.get('/proxy-image', async (req, res) => {
	try {
	  const imageUrl = req.query.url;
	  const response = await fetch(imageUrl);
	  const imageBuffer = await response.buffer(); // Get image as a buffer
	  res.set('Content-Type', response.headers.get('Content-Type'));
	  res.send(imageBuffer); // Send image buffer back to client
	} catch (error) {
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
  

app.use('/api', apiRouter);

export default app;

