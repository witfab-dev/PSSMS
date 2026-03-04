import React, { useState, useEffect } from 'react';
import axiosClient from '../axiosClient';

function ParkingRecordForm() {
  const [records, setRecords] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [slotNumber, setSlotNumber] = useState('');
  const [entryTime, setEntryTime] = useState('');

  // 1. RETRIEVE: Fetch records on load (Requirement 8)
  const fetchRecords = () => {
    axiosClient.get('/parkingrecord')
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 2. INSERT: Add new record
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient.post('/parkingrecord', {
      PlateNumber: plateNumber,
      SlotNumber: slotNumber,
      EntryTime: entryTime
    })
    .then(() => {
      alert('Record added!');
      fetchRecords(); // Refresh table
      setPlateNumber(''); setSlotNumber(''); setEntryTime('');
    })
    .catch(() => alert('Failed to add record. Ensure Plate and Slot exist.'));
  };

  // 3. DELETE: Remove record (Requirement 8)
  const handleDelete = (id) => {
    if (window.confirm("Delete this record permanently?")) {
      axiosClient.delete(`/parkingrecord/${id}`)
        .then(() => {
          alert("Record deleted");
          fetchRecords();
        });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* INSERT FORM */}
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md border-t-4 border-blue-500 mb-8">
        <h2 className="text-xl font-bold mb-4">New Entry Record</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Plate Number" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="border p-2 rounded" required />
          <input type="text" placeholder="Slot Number" value={slotNumber} onChange={(e) => setSlotNumber(e.target.value)} className="border p-2 rounded" required />
          <input type="datetime-local" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className="border p-2 rounded" required />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Check-In Car</button>
      </form>

      {/* RETRIEVE TABLE */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <h2 className="p-4 font-bold bg-gray-50 border-b">Active & Past Records</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Plate</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Entry Time</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map(rec => (
              <tr key={rec.RecordID} className="text-sm">
                <td className="p-3">{rec.PlateNumber}</td>
                <td className="p-3">{rec.SlotNumber}</td>
                <td className="p-3">{new Date(rec.EntryTime).toLocaleString()}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(rec.RecordID)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParkingRecordForm;