import mongoose from 'mongoose';
// can add other fields like the type of event, upload, deletion etc
const logSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dataSize: { type: Number, required: true },
  totalDataUsed: { type: Number, required: true },
});

const Log = mongoose.model('Log', logSchema);

export default Log;
