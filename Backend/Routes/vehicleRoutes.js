import express from 'express';
import Vehicle from '../Models/Vehicles.model.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

// 1. Cloudinary Config (Environment variables se data uthana)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Multer ko batana ki photo Cloudinary par save karni hai
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vehicle_dealership', // Cloudinary mein is naam ka folder banega
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    },
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// GET API (Public)
router.get('/', async(req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST API (Protected)
router.post('/', authMiddleware, upload.single('image'), async(req, res) => {
    try {
        const newVehicleData = {
            ...req.body,
            // req.file.path ab hume Cloudinary ka direct URL dega! ☁️
            imageUrl: req.file ? req.file.path : ''
        };
        const newVehicle = new Vehicle(newVehicleData);
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE API (Protected)
router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) return res.status(404).json({ message: "Gaadi nahi mili" });
        res.json({ message: "Gaadi successfully delete ho gayi! 🗑️" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
