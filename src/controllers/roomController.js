import fs from 'fs-extra';
import { z } from 'zod';
import * as roomService from '../services/roomService.js';
import config from '../config/config.js';

const roomSchema = z.object({
  features: z.array(z.string()).optional(),
  price: z.number().positive(),
  capacity: z.number().int().positive(),
  availability: z.boolean(),
  name: z.string().optional(),
  description: z.string().optional()
});
const bulkRoomSchema = z.object({
  availability: z.boolean(),
  name: z.string().optional(),
  description: z.string().optional(),
});

const createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body, req.files?.image);
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const editRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = roomSchema.partial().parse(req.body);

    const roomSaved = await roomService.editRoom(id, validatedData, req.files?.image);
    res.status(200).json(roomSaved);
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    await roomService.deleteRoom(id)

    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    next(error);
  }
};

const getRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getRooms(req.query);
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

const bulkCreateRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.bulkCreateRooms(req.body);
    res.status(201).json(rooms);
  } catch (error) {
    next(error);
  }
}

const bulkDeleteRooms = async (req, res, next) => {
  try {
    const result = await roomService.bulkDeleteRooms(req.body);
    res.status(200).json({ message: `Deleted ${result.deletedCount} rooms` });
  } catch (error) {
    next(error);
  }
};

const toggleRoomAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await roomService.toggleRoomAvailability(id,req.body)
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};


export { 
  createRoom, 
  editRoom, 
  deleteRoom, 
  getRooms, 
  getRoom,
  bulkCreateRooms,
  bulkDeleteRooms,
  toggleRoomAvailability
};