import express from 'express';
import { 
	createAnnouncement, 
	listAnnouncement,
    myAnnouncementListing, 
	myFavoriteAnnouncementListing,
	getAnnouncementDetails,
	getListGlobal,
	getListGetGpApartment,
	getListGetGpDelivery,
	getListGetGpCar,
	getListGlobalRand
} from '../controllers/announcement.controller.js';
const router = express.Router();
import multer from 'multer';
import path from 'path';

router.post('/create-test-data', async (req, res, next) => {
	res.return(
		await createAnnouncement({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			// user: req.user,
		})
	);
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(file);
		cb(null, 'upload-announcement-files/');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	},
});
//multiple images
var multiUploadImages = multer({ storage: storage }).any('images');
router.post('/create', async (req, res, next) => {
	const files= [];
	multiUploadImages(req, res, async function (err) {
		if (req.files.length > 0) {
			req.files.forEach((fileData, fileIndex) => {
				console.log(fileData);
				const filePath = fileData.path;
				const newFilePath = filePath.replace(/\\/g, '/');
				const fileNameUsingRegex = newFilePath.match(/\/([^\/]+)$/)[1];
				const fileType = fileNameUsingRegex.split('_')[0];
				files.push({path: newFilePath, fileType }); // Push the file path to the images array
			});
		}
		res.return(
			await createAnnouncement({
				payload: { ...req.params, ...req.query, ...req.body },
				headers: req.headers,
				user: req.user,
				files,
				 
			})
		);
	});
});

router.get('/my-listing', async (req, res, next) => {
	res.return(
		await myAnnouncementListing({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/my-favorite-listing', async (req, res, next) => {
	res.return(
		await myFavoriteAnnouncementListing({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
//list announcement
router.get('/list-announcement', async (req, res, next) => {
	res.return(
		await listAnnouncement({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-get-global', async (req, res, next) => {
	res.return(
		await getListGlobal({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-get-global-rand', async (req, res, next) => {
	res.return(
		await getListGlobalRand({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-get-gp-apartment', async (req, res, next) => {
	res.return(
		await getListGetGpApartment({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-get-gp-delivery', async (req, res, next) => {
	res.return(
		await getListGetGpDelivery({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/list-get-gp-car', async (req, res, next) => {
	res.return(
		await getListGetGpCar({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

//get announcement
router.get('/get-announcement', async (req, res, next) => {
	res.return(
		await getAnnouncementDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

export default router;
