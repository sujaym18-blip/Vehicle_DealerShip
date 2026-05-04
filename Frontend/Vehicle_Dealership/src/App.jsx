import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddVehicle from './pages/AddVehicle';
import Auth from './pages/Auth'; // 👈 Naya page import kiya

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddVehicle />} />
        <Route path="/auth" element={<Auth />} /> {/* 👈 Naya route add kiya */}
      </Routes>
    </Router>
  );
}

export default App;