import '../config/environment.js';
import express from 'express';
const router = express.Router();
import { 
	login,
	adminLogin, 
	loginUsingUserId, 
	register, 
	checkUserNameAvailability, 
	sendEmailOtp, 
	verifyEmailOtp,
    sendForgetPasswordEmail
} from '../controllers/login.controller.js';
import announcementRouter from './announcement.router.js';

import { addAmountToUserWallet } from  '../controllers/auth.controller.js';
import { getSettings } from  '../controllers/settings.controller.js';
 

router.post('/login', async (req, res, next) => {
	res.send(await login({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.post('/admin-login', async (req, res, next) => {
	res.send(await adminLogin({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});




router.post('/login/using-user-id', async (req, res, next) => {
	res.send(await loginUsingUserId({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.post('/register', async (req, res, next) => {
	res.send(await register({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});


router.get('/send-forget-password-email', async (req, res, next) => {
	res.send(await sendForgetPasswordEmail({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});



router.post('/check-username-availibility', async (req, res, next) => {
	res.send(await checkUserNameAvailability({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.post('/send-email-otp', async (req, res, next) => {
	res.send(await sendEmailOtp({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});
router.post('/verify-email-otp', async (req, res, next) => {
	res.send(await verifyEmailOtp({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});


router.get('/update-user-wallet', async (req, res, next) => {
	res.send(await addAmountToUserWallet({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.get('/get-settings', async (req, res, next) => {
	res.send(await getSettings({ payload: { ...req.params, ...req.query, ...req.body }, headers: req.headers }));
});

router.use('/announcement', announcementRouter);

export default router;
