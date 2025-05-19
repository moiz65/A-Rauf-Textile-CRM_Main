import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Invoices from './pages/Invoices';
import Report from './pages/Report';

// // Import Poppins font weights
// import '@fontsource/poppins/400.css';  // font-normal
// import '@fontsource/poppins/500.css';  // font-medium
// import '@fontsource/poppins/600.css';  // font-semibold
// import '@fontsource/poppins/700.css';  // font-bold

function App() {
  return (
    <div className="App font-sans min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} /> {/* Default to login */}
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/report" element={<Report />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;