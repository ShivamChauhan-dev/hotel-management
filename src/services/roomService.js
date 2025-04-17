import Room from '../models/Room.js';
import { roomSchema, getRoomsSchema, idSchema, bulkCreateSchema, updateRoomSchema, roomAvailabilitySchema } from '../utils/validationSchemas.js';
import { uploadImageToCloudinary, deleteImage } from '../utils/utils.js';
  
  
class RoomService {
  async createRoom(roomData, image) {
    await roomSchema.parseAsync(roomData);
    const result = await uploadImageToCloudinary(image.path);
    const newRoom = new Room({ ...roomData, image: result.url });
    return await newRoom.save();
  }

  async getRooms(query) {
    await getRoomsSchema.parseAsync(query);
    const { page = 1, limit = 10, search, sortBy = 'price', sortOrder = 'asc', ...filters } = query;
    const skip = (page - 1) * limit;

    const mongoQuery = {};
    if (search) {
      mongoQuery.$text = { $search: search };
    }

    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      mongoQuery.price = { $gte: min, $lte: max };
    }

    if (filters.capacity) {
      mongoQuery.capacity = { $gte: Number(filters.capacity) };
    }

    if (filters.features) {
      mongoQuery.features = { $in: filters.features.split(',') };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const rooms = await Room.find(mongoQuery)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalRooms = await Room.countDocuments(mongoQuery);
    return {
      rooms,
      totalPages: Math.ceil(totalRooms / limit),
      currentPage: Number(page),
    };
  }

  async getRoom(id) {
    await idSchema.parseAsync({ id });
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  async editRoom(id, roomData, image) {
    await updateRoomSchema.parseAsync({ id, ...roomData });
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }
    if (image) {
      await deleteImage(room.image);
      const result = await uploadImageToCloudinary(image.path);
      roomData.image = result.url;
    }
    const updatedRoom = await Room.findByIdAndUpdate(id, roomData, { new: true });
    return updatedRoom;
  }

  async deleteRoom(id) {
    await idSchema.parseAsync({ id });
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }
    await deleteImage(room.image);
    await Room.findByIdAndDelete(id);
  }

  async bulkCreateRooms(roomsData) {
    await bulkCreateSchema.parseAsync(roomsData);
    const createdRooms = await Room.insertMany(roomsData);
    return createdRooms;
  }

  async bulkDeleteRooms(roomIds) {
    await idSchema.array().parseAsync(roomIds);
    const deletePromises = roomIds.map(async (roomId) => {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error(`Room with ID ${roomId} not found`);
      }
      await deleteImage(room.image);
      await Room.findByIdAndDelete(roomId);
    });

    await Promise.all(deletePromises);
  }

  async getRoomsByAvailability(query){
    await roomAvailabilitySchema.parseAsync(query);
    const { available } = query;
    const rooms = await Room.find({ availability: available });
    return rooms;
  }
  
  async updateAvailability(id, availability) {
    await idSchema.parseAsync({ id });
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }
    room.availability = availability;
    await room.save();
  }
}

const roomService = new RoomService();

export default roomService;