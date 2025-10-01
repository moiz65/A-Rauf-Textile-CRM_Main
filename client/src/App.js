import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Invoices from './pages/Invoices';
import Report from './pages/Report';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import Expense from './pages/Expense';
import ReportData from './pages/ReportData';
import InvoiceDetails from './components/InvoiceDetails';
import PurchaseOrder from './pages/PurchaseOrder';  
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';


// // Import Poppins font weights
// import '@fontsource/poppins/400.css';  // font-normal
// import '@fontsource/poppins/500.css';  // font-medium
// import '@fontsource/poppins/600.css';  // font-semibold
// import '@fontsource/poppins/700.css';  // font-bold

function App() {
  return (
    <div className="App font-sans min-h-screen bg-gray-50">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} /> {/* Default to login */}

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/invoiceform" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
            <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
            <Route path="/reportdata" element={<ProtectedRoute><ReportData /></ProtectedRoute>} />
            <Route path="/invoice/:id" element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
            <Route path="/invoice/:type/:id" element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
            <Route path="/purchase-order" element={<ProtectedRoute><PurchaseOrder /></ProtectedRoute>} />
            <Route path="/purchase-order/:poId" element={<ProtectedRoute><PurchaseOrder /></ProtectedRoute>} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;