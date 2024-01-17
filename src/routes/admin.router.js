import express from 'express';
import { nftList, orderList, productList, userList, setPromote, updateUserEmail, updateUserPassword } from '../controllers/admin.controller.js';
import authPermission from '../middlewares/authPermission.js';

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


router.get('/nft-list', async (req, res, next) => {
	res.return(
		await nftList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/product-list', async (req, res, next) => {
	res.return(
		await productList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/order-list', async (req, res, next) => {
	res.return(
		await orderList({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

export default router;
