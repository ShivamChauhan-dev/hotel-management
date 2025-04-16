import express from 'express';
import { register, login, getUsers, changeUserRole, enableDisableUser, deleteUser } from '../controllers/authController.js';
import { createAdminUser } from '../services/userService.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/admin', authMiddleware, roleMiddleware(['admin']), async (req, res, next) => {
  await createAdminUser(req.body);
});
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.put('/:id/role', authMiddleware, roleMiddleware(['admin']), changeUserRole);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), enableDisableUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);






export default router;