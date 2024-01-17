import express from 'express';
import { getProfileDetails, editProfile } from '../controllers/profile.controller.js';
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
router.post('/edit', async (req, res, next) => {
	res.return(
		await editProfile({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});
export default router;
