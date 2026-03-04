import React from 'react';

function Invoice({ billData, onClose }) {
  if (!billData) return null;

  // Format Helper to keep the JSX clean
  const formatDate = (dateValue) => {
    const d = new Date(dateValue);
    return isNaN(d) ? "N/A" : d.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full border-t-8 border-purple-600 print:shadow-none print:border-none">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">SmartPark Receipt</h2>
          <p className="text-xs text-gray-500 uppercase">Rubavu District, Rwanda</p>
        </div>

        <div className="space-y-3 text-sm border-b border-dashed pb-4 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Plate Number:</span>
            <span className="font-bold font-mono">{billData.PlateNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Entry:</span>
            <span>{formatDate(billData.EntryTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Exit:</span>
            <span>{formatDate(billData.ExitTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duration:</span>
            <span className="font-medium text-gray-800">{billData.Duration} Hour(s)</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-700">Total Paid:</span>
          <span className="text-2xl font-black text-purple-700">{billData.AmountPaid} RWF</span>
        </div>

        {/* This div will be hidden by our @media print CSS */}
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()} 
            className="flex-1 bg-gray-800 text-white py-2.5 rounded-md font-bold hover:bg-gray-900 transition-colors"
          >
            Print Receipt
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 bg-purple-50 text-purple-700 py-2.5 rounded-md font-bold hover:bg-purple-100 transition-colors"
          >
            Done
          </button>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-6 italic">
          Software powered by SmartPark PSSMS.
        </p>
      </div>
    </div>
  );
}

export default Invoice;