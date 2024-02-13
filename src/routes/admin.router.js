import express from 'express';
import {   
	userList, 
	setPromote, 
	announcmentList, 
	contactUstList, 
	updateUserEmail, 
	updateUserPassword,
	categories,
	locations,
	subLocations
 } from '../controllers/admin.controller.js';
import authPermission from '../middlewares/authPermission.js';
import { addAmountToUserWallet } from '../controllers/auth.controller.js';

const router = express.Router();

router.use(authPermission('admin'));

router.get('/user-list', async (req, res, next) => {
	res.return(
		await userList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/categories', async (req, res, next) => {
	res.return(
		await categories({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/locations', async (req, res, next) => {
	res.return(
		await locations({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/update-user-wallet', async (req, res, next) => {
	res.send(await addAmountToUserWallet({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.get('/sub-locations', async (req, res, next) => {
	res.return(
		await subLocations({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.get('/announcment-list', async (req, res, next) => {
	res.return(
		await announcmentList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/contact-us-list', async (req, res, next) => {
	res.return(
		await contactUstList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
})



router.get('/promote-user', async (req, res, next) => {
	res.return(
		await setPromote({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/update-user-email', async (req, res, next) => {
	res.return(
		await updateUserEmail({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.post('/update-user-password', async (req, res, next) => {
	res.return(
		await updateUserPassword({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


 
 

 

export default router;
