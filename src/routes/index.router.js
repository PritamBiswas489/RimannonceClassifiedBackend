import express from 'express';
const router = express.Router();
import { default as authRouter } from './auth.router.js';
import { default as frontRouter } from './front.router.js';

router.use('/auth', authRouter);
router.use('/front', frontRouter);

export default router;
