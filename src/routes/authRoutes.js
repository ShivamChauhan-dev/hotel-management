import express from 'express';
import { register, login, createAdminUser, getAllUsers, changeUserRole, toggleUserStatus, deleteUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/admin', authMiddleware, roleMiddleware(['admin']), createAdminUser);
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);
router.put('/:id/role', authMiddleware, roleMiddleware(['admin']), changeUserRole);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), toggleUserStatus);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);






export default router;