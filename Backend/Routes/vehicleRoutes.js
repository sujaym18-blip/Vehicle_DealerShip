import express from 'express';
import Vehicle from '../models/Vehicles.model.js';
import multer from 'multer';
import authMiddleware from '../Middlewares/authMiddleware.js'; // 🛡️ GUARD IMPORT KIYA

const router = express.Router();

// Multer Setup (Waisa hi rahega)
const storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, 'uploads/'); },
    filename: function(req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });


// 1. GET API (Public - Koi guard nahi, sab gaadiyan dekh sakte hain)
router.get('/', async(req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. POST API (Protected - Yahan bich mein 'authMiddleware' laga diya)
router.post('/', authMiddleware, upload.single('image'), async(req, res) => {
    try {
        const newVehicleData = {
            ...req.body,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        };
        const newVehicle = new Vehicle(newVehicleData);
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. DELETE API (Protected - Yahan bhi 'authMiddleware' laga diya)
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