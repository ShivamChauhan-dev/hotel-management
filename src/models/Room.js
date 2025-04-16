import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;