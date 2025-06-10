import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Invoices from './pages/Invoices';
import Report from './pages/Report';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Invoiceform from './components/InvoiceForm';
import Expense from './pages/Expense';
import ReportData from './pages/ReportData';


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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/report" element={<Report />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoiceform" element={<Invoiceform />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/reportdata" element={<ReportData />} />

          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;