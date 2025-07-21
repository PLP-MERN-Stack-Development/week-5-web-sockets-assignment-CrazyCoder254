import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMessages, getPrivateMessages } from '../controllers/messageController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMessages);
router.get('/private/:userId1/:userId2', getPrivateMessages);

export default router;