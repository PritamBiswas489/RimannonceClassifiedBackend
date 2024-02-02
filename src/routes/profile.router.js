import express from 'express';
import { getProfileDetails, editProfile, getUserWalletAmount, deleteUserAccount, contactUs } from '../controllers/profile.controller.js';
const router = express.Router();

router.get('/detail', async (req, res, next) => {
	res.return(
		await getProfileDetails({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
router.get('/get-user-wallet-amount', async (req, res, next) => {
	res.return(
		await getUserWalletAmount({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
    
})
router.post('/edit', async (req, res, next) => {
	res.return(
		await editProfile({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/contact-us', async (req, res, next) => {
	res.return(
		await contactUs({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


//contact-us


router.get('/delete-account', async (req, res, next) => {
	res.return(
		await deleteUserAccount({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
    
})
export default router;
