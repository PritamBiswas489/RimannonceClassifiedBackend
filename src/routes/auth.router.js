import express from 'express';
// import { fileTypeFromBuffer } from 'file-type';
// import fs from 'fs';
// import path, { dirname } from 'path';
import db from '../databases/models/index.js';
import { default as jwtVerify } from '../middlewares/jwtVerify.js';
import authPermission from '../middlewares/authPermission.js';
import { getAuthUser } from '../controllers/auth.controller.js';
import profileRouter from './profile.router.js';
import adminRouter from './admin.router.js';
import blogRouter from './blog.router.js';
import contentRouter from './content.router.js';
import notificationRouter from './notification.router.js';
import likeRouter from './like.router.js';
import ticketTypeRouter from './ticketType.router.js';
import ticketRouter from './ticket.router.js';
import ticketConversationRouter from './ticketConversation.router.js';
const { Log, User } = db;

const router = express.Router();

router.use(jwtVerify);
// router.use(authPermission('user', 'admin'));

router.get('/get-auth-user', async (req, res, next) => {
	res.return(
		await getAuthUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.use('/profile', profileRouter);
router.use('/admin', adminRouter);
router.use('/blog', blogRouter);
router.use('/content', contentRouter);
router.use('/ticket-type', ticketTypeRouter);
router.use('/ticket', ticketRouter);
router.use('/ticket-conversation', ticketConversationRouter);
router.use('/notification', notificationRouter);
router.use('/like', likeRouter);

export default router;
