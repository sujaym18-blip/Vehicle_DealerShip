// 1. ZAROORI PACKAGES IMPORT KARNA
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './Routes/authRoutes.js';

// HAMARI ROUTE FILE IMPORT KARNA (Dhyan rahe .js lagana zaroori hai!)
import vehicleRoutes from './routes/vehicleRoutes.js';

// .env file se password aur PORT read karne ki permission
dotenv.config();

// Express app (Hamara Engine) banana
const app = express();

// 2. MIDDLEWARES SETUP
app.use(cors()); // React (Frontend) ko is server se baat karne dega
app.use(express.json()); // Frontend se aane wale data ko JSON mein convert karega

app.use(express.json());
// YEH NAYI LINE ADD KAREIN:
app.use('/uploads', express.static('uploads'));


// 3. MONGODB ATLAS SE CONNECTION
// process.env.MONGO_URI aapki .env file se Atlas ka link layega
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas se successfully connect ho gaya! 🎉🚗"))
    .catch((err) => console.log("Database connection error: ", err));


// 4. MAIN ROUTING JODNA (The Most Important Line)
// Iska matlab: Agar koi http://localhost:5000/api/vehicles par request bheje, 
// toh usko handle karne ki zimmedari 'vehicleRoutes' ki hai.
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);


// Ek basic Test Route (Sirf check karne ke liye ki server chal raha hai ya nahi)
app.get('/', (req, res) => {
    res.send("Vehicle Dealership API engine is running smoothly...");
});


// 5. SERVER START KARNA
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server port ${PORT} par daud raha hai 🚀...`);
});
