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
import multer from 'multer';
import path from 'path';



const router = express.Router();

router.use(jwtVerify);

router.get('/get-auth-user', async (req, res, next) => {
	res.return(
		await getAuthUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
	  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
	  cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	},
});
const upload = multer({ storage: storage });  
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
	try {
	  if (!req.file) {
		  res.return({ status: 400, data: [], error: { message: 'No file provided', reason: e.message } });
	  }
	  const filePath = req.file.path;
	  const newFilePath = filePath.replace(/\\/g, '/');
	  await User.update({avatar:newFilePath}, {
		where: {
			id: req.user.id,
		},
	  });
	  res.return( { status: 200, data: { imagePath: newFilePath, user_id : req.user.id }, message: '' });
	} catch (e) {
	  if (e.message === 'No file provided') {
		 res.return({ status: 400, data: [], error: { message: 'No file provided', reason: e.message } });
	  } else {
	 	 res.return({ status: 500, data: [], error: { message: 'Something went wrong !', reason: e.message } });
	  }
	}
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
