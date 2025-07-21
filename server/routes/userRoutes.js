import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;