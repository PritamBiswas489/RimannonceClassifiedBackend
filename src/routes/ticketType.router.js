import express from 'express';


import { 
    createContent, 
    listContent, 
    details, 
    editContent, 
    destroy  } from '../controllers/ticketType.controller.js';

const router = express.Router();

router.post('/create', async (req, res, next) => {
    res.return(
		await createContent({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			user: req.user,
		})
	);
});


router.get('/list', async (req, res, next) => {
    res.return(
		await listContent({
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


router.put('/edit/:id', async (req, res, next) => {
    res.return(
		await editContent({
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

export default router;