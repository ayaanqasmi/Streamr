import mongoose from 'mongoose';
// can add other fields like the type of event, upload, deletion etc
const loggingSchema = new mongoose.Schema({
  message: { type: String, required: true }, 
}, {
    timestamps: true
});

const Log = mongoose.model('Log', loggingSchema);

export default Log;