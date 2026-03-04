import { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function ParkingSlotForm() {
  const [slotNumber, setSlotNumber] = useState('');
  const [status, setStatus] = useState('Available');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Data to send to the backend
    const slotData = {
      SlotNumber: parseInt(slotNumber), // Must be a number for your DB
      SlotStatus: status
    };

    // We use axiosClient to send data to the server, NOT 'app' or 'db'
    axiosClient.post('/parkingslot', slotData)
      .then(res => {
        alert("Slot added successfully!");
        setSlotNumber('');
      })
      .catch(err => {
        console.error(err);
        alert("Error adding slot. Make sure the server is running.");
      });
  };

  return (
    <div className="flex justify-center p-6 text-gray-800">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg w-96 border">
        <h2 className="text-xl font-bold mb-4">Add Parking Slot</h2>
        
        <label className="block text-sm mb-1">Slot Number (Integer)</label>
        <input 
          type="number" 
          className="border p-2 mb-3 w-full rounded" 
          value={slotNumber} 
          onChange={e => setSlotNumber(e.target.value)} 
          required 
        />

        <label className="block text-sm mb-1">Status</label>
        <select 
          className="border p-2 mb-4 w-full rounded"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="Available">Available</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <button className="bg-green-600 text-white p-2 rounded w-full font-bold">
          Save Slot
        </button>
      </form>
    </div>
  );
}