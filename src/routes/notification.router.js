import express from 'express';
import { createNotification, notificationList, notificationMarkAsRead, notificationDelete,notificationUnReadListCount } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/create', async (req, res, next) => {
	res.send(
		await createNotification({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
		})
	);
})
router.get('/list', async (req, res, next) => {
	res.send(
		await notificationList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
})

router.get('/unread-list', async (req, res, next) => {
	res.send(
		await notificationUnReadListCount({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
})

router.get('/mark-read', async (req, res, next) => {
	res.send(
		await notificationMarkAsRead({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
		})
	);
})
router.get('/delete/:notificationId', async (req, res, next) => {
	res.send(
		await notificationDelete({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
		})
	);
})


export default router;