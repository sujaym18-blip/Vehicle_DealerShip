import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 👈 useNavigate yahan se hata diya

const Navbar = () => {
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
    
    // Token check karna
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Logout ka function 
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav style={{ background: '#222', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🚗 Dealership Pro</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                
                {/* AGAR TOKEN HAI TABHI YEH BUTTONS DIKHENGE */}
                {token ? (
                    <>
                        <Link to="/add" style={{ color: 'white', textDecoration: 'none', background: '#28a745', padding: '8px 15px', borderRadius: '5px' }}>+ Add</Link>
                        <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <Link to="/auth" style={{ color: 'white', textDecoration: 'none', background: '#007bff', padding: '8px 15px', borderRadius: '5px' }}>Admin Login</Link>
                )}
                
                <button 
                    onClick={() => setIsDark(!isDark)} 
                    style={{ padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', border: 'none', background: isDark ? '#f1c40f' : '#4b6584', color: isDark ? '#000' : '#fff', fontWeight: 'bold' }}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;