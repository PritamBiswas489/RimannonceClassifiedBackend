import express from 'express';
const router = express.Router();
import { createLike, getData } from '../controllers/like.controller.js';

router.get('/create', async (req, res, next) => {
	res.send(
		await createLike({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
            user: req.user,
		})
	);
})

router.get('/get', async (req, res, next) => {
	res.send(
		await getData({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
            user: req.user,
		})
	);
})

export default router;