import express from 'express';
import { createAnnouncement, listAnnouncement } from '../controllers/announcement.controller.js';
const router = express.Router();

router.get('/create-test-data', async (req, res, next) => {
	res.return(
		await createAnnouncement({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			// user: req.user,
		})
	);
});

router.get('/list-announcement', async (req, res, next) => {
    res.return(
		await listAnnouncement({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
})

export default router;