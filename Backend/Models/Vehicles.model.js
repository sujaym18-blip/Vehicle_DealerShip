import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String, required: false },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// Export karne ka naya tarika
export default mongoose.model('Vehicle', vehicleSchema);