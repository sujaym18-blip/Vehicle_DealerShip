import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // 1. Request ke 'Headers' se token nikalna (Aam taur par log "Bearer <token>" format mein bhejte hain)
    const token = req.header('Authorization');

    // 2. Agar token nahi hai, toh turant bahar nikal do
    if (!token) {
        return res.status(401).json({ message: "Access Denied! ID Card (Token) nahi mila." });
    }

    try {
        // 3. Token ko check karna ki asli hai ya nakli (hamare secret password se)
        // Dhyan dein: 'Bearer ' word ko hatakar sirf token check karte hain
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // 4. Agar token sahi hai, toh aage badhne do (next function call karo)
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Galat ya Expired Token!" });
    }
};

export default authMiddleware;