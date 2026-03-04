import { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function CarForm() {
  const [plateNumber, setPlateNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // EXACT MATCH for your DESCRIBE CAR fields
    const carData = {
      PlateNumber: plateNumber,
      DriverName: driverName,
      PhoneNumber: phoneNumber
    };

    axiosClient.post('/car', carData)
      .then(res => {
        alert("Car Registered Successfully!");
        setPlateNumber('');
        setDriverName('');
        setPhoneNumber('');
      })
      .catch(err => {
        // If 500 happens, this alert will show the SQL error message
        console.error(err);
        alert("Error 500: Check if Plate Number already exists or Database is disconnected.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md border-b-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New Vehicle</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Plate Number (Required)</label>
          <input 
            type="text" 
            placeholder="e.g., RAE 001 A"
            className="mt-1 border-2 p-3 w-full rounded-md focus:border-blue-500 outline-none" 
            value={plateNumber} 
            onChange={e => setPlateNumber(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Driver Name</label>
          <input 
            type="text" 
            placeholder="Enter full name"
            className="mt-1 border-2 p-3 w-full rounded-md focus:border-blue-500 outline-none" 
            value={driverName} 
            onChange={e => setDriverName(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600">Phone Number</label>
          <input 
            type="text" 
            placeholder="e.g., 078XXXXXXX"
            className="mt-1 border-2 p-3 w-full rounded-md focus:border-blue-500 outline-none" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)} 
          />
        </div>

        <button 
          disabled={loading}
          className={`w-full p-3 rounded-md font-bold text-white transition-all ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
          }`}
        >
          {loading ? 'Registering...' : 'Save Vehicle'}
        </button>
      </form>
    </div>
  );
}