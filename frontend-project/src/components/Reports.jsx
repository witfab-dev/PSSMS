import React, { useEffect, useState } from 'react';
import axiosClient from '../axiosClient';

function Reports() {
  const [dailyPayments, setDailyPayments] = useState([]);

  useEffect(() => {
    // Fetch only today's payments as per Requirement 13
    axiosClient.get('/reports/daily')
      .then(res => setDailyPayments(res.data))
      .catch(err => console.error("Error fetching report:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2">
          Daily Parking Payment Report
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 border">Plate Number</th>
                <th className="p-3 border">Entry Time</th>
                <th className="p-3 border">Exit Time</th>
                <th className="p-3 border">Duration (Hrs)</th>
                <th className="p-3 border">Amount (RWF)</th>
              </tr>
            </thead>
            <tbody>
              {dailyPayments.length > 0 ? dailyPayments.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border font-semibold">{report.PlateNumber}</td>
                  <td className="p-3 border">{new Date(report.EntryTime).toLocaleString()}</td>
                  <td className="p-3 border">
                    {report.ExitTime ? new Date(report.ExitTime).toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-3 border text-center">{report.Duration || 0}</td>
                  <td className="p-3 border font-bold text-green-600">
                    {report.AmountPaid} RWF
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500 italic">
                    No payments recorded for today.
                  </td>
                </tr>
              )}
            </tbody>
            {dailyPayments.length > 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="4" className="p-3 border text-right">Total Revenue:</td>
                  <td className="p-3 border text-blue-700">
                    {dailyPayments.reduce((acc, curr) => acc + parseFloat(curr.AmountPaid), 0)} RWF
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;