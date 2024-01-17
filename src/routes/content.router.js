import express from 'express';

import { createContent, listContent, details, editContent, destroy, homeSaveContent, getHomeContent, aboutSaveContent, getAboutContent, contactUsSaveContent, getContactUsContent } from '../controllers/content.controller.js';
 

const router = express.Router();

router.post('/create', async (req, res, next) => {
	res.return(
		await createContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.post('/homesave', async (req, res, next) => {
	res.return(
		await homeSaveContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/gethomeData', async (req, res, next) => {
	res.return(
		await getHomeContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/aboutsave', async (req, res, next) => {
	res.return(
		await aboutSaveContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/getaboutData', async (req, res, next) => {
	res.return(
		await getAboutContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/contactussave', async (req, res, next) => {
	res.return(
		await contactUsSaveContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/getcontactusData', async (req, res, next) => {
	res.return(
		await getContactUsContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});







router.get('/list', async (req, res, next) => {
	res.return(
		await listContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});





router.get('/details/:id', async (req, res, next) => {
	res.return(
		await details({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});



router.put('/edit/:id', async (req, res, next) => {
	res.return(
		await editContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.delete('/delete/:id', async (req, res, next) => {
	res.return(
		await destroy({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


export default router;