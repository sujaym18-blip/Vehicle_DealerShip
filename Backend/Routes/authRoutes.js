import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 1. REGISTER API: Naya Admin Account Banane ke liye
router.post('/register', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Check karna ki user pehle se toh nahi hai
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User pehle se exist karta hai!" });

        // Password ko encrypt (hash) karna taaki database mein safe rahe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Naya user save karna
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Admin account successfully ban gaya!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. LOGIN API: Token (ID Card) Lene ke liye
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // User dhoondhna
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User nahi mila!" });

        // Password match karna
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Galat password!" });

        // Token banana (ID card) jo 1 din ke liye valid rahega
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;