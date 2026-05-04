import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Home par bhejne ke liye

const AddVehicle = () => {
    const [formData, setFormData] = useState({
        brand: '', model: '', year: '', price: '', type: 'SUV'
    });
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. JWT Token (ID Card) check karna
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Sirf Admin gaadi add kar sakta hai. Pehle login karein!");
            return;
        }

        const data = new FormData();
        data.append('brand', formData.brand);
        data.append('model', formData.model);
        data.append('year', formData.year);
        data.append('price', formData.price);
        data.append('type', formData.type);
        if (image) {
            data.append('image', image);
        }

        try {
            // 2. Data aur Token dono backend ko bhejna
            await axios.post('http://localhost:5000/api/vehicles', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // 🛡️ GUARD KO ID CARD DIKHA RAHE HAIN
                }
            });
            
            alert("Gaadi successfully add ho gayi! 🎉");
            navigate('/'); // Add hote hi Home page par wapas bhej do
        } catch (error) {
            console.error("Error saving vehicle:", error);
            alert("Session expire ho gaya ya error aayi! Wapas login karein.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>Nayi Gaadi Add Karein 🚙</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input type="text" name="brand" placeholder="Brand (e.g., Mahindra)" value={formData.brand} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px' }} />
                <input type="text" name="model" placeholder="Model (e.g., Scorpio)" value={formData.model} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px' }} />
                <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px' }} />
                <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px' }} />
                
                <select name="type" value={formData.type} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px' }}>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Bike">Bike</option>
                </select>

                <div style={{ padding: '10px', border: '1px dashed #ccc', background: 'white', borderRadius: '5px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'black' }}>Photo Upload Karein:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} required />
                </div>

                <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '5px', fontWeight: 'bold' }}>
                    Save Vehicle
                </button>
            </form>
        </div>
    );
};

export default AddVehicle;