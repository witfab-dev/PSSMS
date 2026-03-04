import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import CarForm from './components/CarForm';
import ParkingSlotForm from './components/ParkingSlotForm';
import ParkingRecordForm from './components/ParkingRecordForm';
import PaymentForm from './components/PaymentForm';
import Reports from './components/Reports';
import Login from './components/Login';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-48 p-4 flex flex-col z-40
            transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
          >
            <h2 className="text-xl font-bold mb-4">SmartPark</h2>
            <Link className="mb-2 hover:bg-gray-700 p-2 rounded" to="/car" onClick={() => setSidebarOpen(false)}>Car</Link>
            <Link className="mb-2 hover:bg-gray-700 p-2 rounded" to="/slot" onClick={() => setSidebarOpen(false)}>ParkingSlot</Link>
            <Link className="mb-2 hover:bg-gray-700 p-2 rounded" to="/record" onClick={() => setSidebarOpen(false)}>ParkingRecord</Link>
            <Link className="mb-2 hover:bg-gray-700 p-2 rounded" to="/payment" onClick={() => setSidebarOpen(false)}>Payment</Link>
            <Link className="mb-2 hover:bg-gray-700 p-2 rounded" to="/reports" onClick={() => setSidebarOpen(false)}>Reports</Link>
            
            <button
              onClick={() => setUser(null)}
              className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded"
            >
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="absolute top-4 left-4 md:hidden bg-gray-800 text-white p-2 rounded z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? 'Close' : 'Menu'}
          </button>

          {/* Main content area */}
          <main className="flex-1 flex flex-col bg-gray-100 ml-0 md:ml-48 h-full overflow-y-auto">
            {/* The 'flex-grow' div pushes the footer down 
                if the page content is short.
            */}
            <div className="flex-grow p-4">
              <Routes>
                <Route path="/" element={<Navigate to="/car" />} />
                <Route path="/car" element={<CarForm />} />
                <Route path="/slot" element={<ParkingSlotForm />} />
                <Route path="/record" element={<ParkingRecordForm />} />
                <Route path="/payment" element={<PaymentForm />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>

            {/* Footer now stays within the main scroll area */}
            <Footer />
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;