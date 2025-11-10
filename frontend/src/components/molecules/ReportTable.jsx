import React from 'react';

const ReportTable = ({ reports, onSelectReport, selectedReportId }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Freelancer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alasan Laporan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Periode
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className={`cursor-pointer hover:bg-blue-50 transition duration-150 ${
                selectedReportId === report.id ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                {report.freelancerName}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                {report.reason}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                {report.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;