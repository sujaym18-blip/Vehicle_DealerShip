import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    
    // Token check karna (Delete Button dikhane ke liye)
    const token = localStorage.getItem('token');

    // Page load hote hi data fetch karna
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vehicles');
                setVehicles(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchVehicles();
    }, []);

    // Delete functionality
    const handleDelete = async (id) => {
        if (!token) {
            alert("Delete karne ke liye Admin login zaroori hai!");
            return;
        }

        if (window.confirm("Kya aap sach mein is gaadi ko delete karna chahte hain?")) {
            try {
                await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
                alert("Gaadi hamesha ke liye delete ho gayi! 🗑️");
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert("Session expire ho gaya hai! Wapas login karein.");
            }
        }
    };

    // Search aur Filter Logic
    const filteredVehicles = vehicles.filter((vehicle) => {
        const searchMatch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = filterType === 'All' || vehicle.type === filterType;
        return searchMatch && typeMatch;
    });

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Available Vehicles 🚘</h2>
            
            {/* SEARCH & FILTER BAR */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Gaadi ka naam dhoondhein..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '12px', width: '100%', maxWidth: '350px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
                />
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', cursor: 'pointer' }}
                >
                    <option value="All">All Types</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Bike">Bike</option>
                </select>
            </div>

            {/* CARDS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                
                {filteredVehicles.length === 0 ? (
                    <p style={{ textAlign: 'center', width: '100%', fontSize: '18px' }}>
                        Koi gaadi nahi mili. Pehle add karein ya search badlein!
                    </p>
                ) : (
                    filteredVehicles.map((vehicle) => (
                        <div key={vehicle._id} className="car-card" style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '10px', 
                            background: 'white', 
                            overflow: 'hidden',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}>
                            
                            {/* ☁️ SMART IMAGE LOGIC YAHAN HAI ☁️ */}
                            <img 
                                src={vehicle.imageUrl 
                                    ? (vehicle.imageUrl.startsWith('http') ? vehicle.imageUrl : `http://localhost:5000${vehicle.imageUrl}`) 
                                    : "https://via.placeholder.com/300x200?text=No+Image+Available"
                                } 
                                alt={vehicle.model} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>{vehicle.brand} {vehicle.model}</h3>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
                                    <span><strong>Type:</strong> {vehicle.type}</span>
                                    <span><strong>Year:</strong> {vehicle.year}</span>
                                </div>
                                
                                <h2 style={{ margin: '0 0 15px 0', color: '#28a745' }}>₹ {vehicle.price.toLocaleString('en-IN')}</h2>
                                
                                {/* Agar token hai, tabhi Delete ka button dikhao */}
                                {token && (
                                    <button 
                                        onClick={() => handleDelete(vehicle._id)} 
                                        style={{ 
                                            width: '100%', 
                                            padding: '10px', 
                                            background: '#dc3545', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '5px', 
                                            cursor: 'pointer', 
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Delete Vehicle
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default Home;