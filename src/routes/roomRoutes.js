import express from 'express';
import { createRoom, editRoom, deleteRoom, getRooms, getRoom, bulkCreateRooms, bulkDeleteRooms, toggleRoomAvailability } from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), createRoom);
router.post('/bulk', authMiddleware, roleMiddleware(['admin']), bulkCreateRooms);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), editRoom);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), toggleRoomAvailability);

router.delete('/bulk', authMiddleware, roleMiddleware(['admin']), bulkDeleteRooms);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteRoom);


router.get('/', getRooms);
router.get('/:id', getRoom);

export default router;