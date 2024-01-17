import express from 'express';
import { createBlog, editBlog, listBlog, details, destroy, commenting, deleteComment } from '../controllers/blog.controller.js';

const router = express.Router();

router.post('/create', async (req, res, next) => {
	res.return(
		await createBlog({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/list', async (req, res, next) => {
	res.return(
		await listBlog({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.put('/edit/:id', async (req, res, next) => {
	res.return(
		await editBlog({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.get('/details/:id', async (req, res, next) => {
	res.return(
		await details({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.delete('/delete/:id', async (req, res, next) => {
	res.return(
		await destroy({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.post('/commenting', async (req, res, next) => {
	res.return(
		await commenting({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

router.delete('/delete-comment/:id', async (req, res, next) => {
	res.return(
		await deleteComment({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});

export default router;
