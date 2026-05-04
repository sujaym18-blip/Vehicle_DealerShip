import { useState } from 'react';
import axios from 'axios';
// 👈 useNavigate ka import yahan se hata diya

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 👈 const navigate = useNavigate(); wali line bhi hata di

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
            
            if (isLogin) {
                // Login successful hone par Token ko browser mein save karna
                localStorage.setItem('token', response.data.token);
                alert("Login Successful! 🔐 Welcome Admin.");
                window.location.href = '/'; // Page reload karke Home par bhejna
            } else {
                alert("Account ban gaya! Ab aap login kar sakte hain.");
                setIsLogin(true); 
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert(error.response?.data?.message || "Kuch gadbad ho gayi!");
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>{isLogin ? 'Admin Login 🔐' : 'Admin Register 📝'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input 
                    type="email" 
                    placeholder="Admin Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                
                <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isLogin ? 'Login' : 'Create Account'}
                </button>
            </form>

            <p style={{ marginTop: '20px', cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'New User? Register Here' : 'Existing User? Login Here'}
            </p>
        </div>
    );
};

export default Auth;