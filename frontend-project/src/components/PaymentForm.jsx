import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import Invoice from './Invoice';

function PaymentForm() {
    const [plateNumber, setPlateNumber] = useState('');
    const [record, setRecord] = useState(null);
    const [amount, setAmount] = useState(0);
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Step 1: Find active record and calculate fee
    const handleSearch = () => {
        if (!plateNumber) return alert("Please enter a plate number");
        
        setLoading(true);
        // Normalize input to uppercase to match database standards
        const searchPlate = plateNumber.toUpperCase().trim();

        axiosClient.get(`/parkingRecords?plateNumber=${searchPlate}`)
            .then(res => {
                const data = res.data[0];
                if (!data) {
                    alert("No active parking session found.");
                    setRecord(null);
                    return;
                }

                const entry = new Date(data.EntryTime);
                const now = new Date();
                
                // Requirement 12: 500 RWF per hour logic
                // Calculate difference in milliseconds, convert to hours, and round up
                const diffInMs = now - entry;
                const hours = Math.ceil(diffInMs / (1000 * 60 * 60));
                
                // Ensure at least 1 hour is charged if they just entered
                const totalHours = hours <= 0 ? 1 : hours;

                setRecord(data);
                setAmount(totalHours * 500);
            })
            .catch(err => {
                console.error(err);
                alert("Search failed. Ensure the car has been 'Checked In' first.");
            })
            .finally(() => setLoading(false));
    };

    // Step 2: Finalize Payment
    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            RecordID: record.RecordID,
            AmountPaid: amount,
            SlotNumber: record.SlotNumber
        };

        axiosClient.post('/payments', payload)
            .then(res => {
                // Combine payload with backend response for the Invoice
                setBillData({
                    PlateNumber: plateNumber.toUpperCase(),
                    EntryTime: record.EntryTime,
                    AmountPaid: amount,
                    ExitTime: res.data.bill.exitTime,
                    Duration: res.data.bill.durationHours
                });
                alert("Payment Successful! Slot " + record.SlotNumber + " is now Available.");
                setRecord(null); // Clear search after success
                setPlateNumber('');
            })
            .catch(err => {
                console.error(err);
                alert("Transaction failed. Check server console for SQL errors.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Vehicle Check-Out</h2>
            
            <div className="flex gap-2 mb-6">
                <input 
                    className="border-2 p-3 flex-1 rounded-md focus:border-blue-500 outline-none uppercase" 
                    placeholder="Enter Plate Number (e.g. RAE 123)"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                />
                <button 
                    onClick={handleSearch} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-md font-bold transition-colors"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </div>

            {record && (
                <form onSubmit={handlePayment} className="space-y-4 border-t-2 border-gray-100 pt-6 animate-pulse-once">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Slot Assigned:</p>
                        <p className="font-bold text-lg">{record.SlotNumber}</p>
                        
                        <p className="text-sm text-gray-500 mt-2">Arrival Time:</p>
                        <p className="font-medium">{new Date(record.EntryTime).toLocaleString()}</p>
                    </div>

                    <div className="text-center py-4">
                        <p className="text-gray-600 uppercase text-xs font-bold tracking-widest">Total Billable Amount</p>
                        <p className="text-4xl font-black text-green-600">{amount} RWF</p>
                        <p className="text-xs text-gray-400 mt-1">Based on 500 RWF / Hourly Rate</p>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-md font-black text-lg shadow-lg transform active:scale-95 transition-all"
                    >
                        {loading ? 'Processing...' : 'CONFIRM & PRINT RECEIPT'}
                    </button>
                </form>
            )}

            {billData && <Invoice billData={billData} onClose={() => setBillData(null)} />}
        </div>
    );
}

export default PaymentForm;