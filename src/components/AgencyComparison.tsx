import React from 'react';
import { agencyComparison } from '../data/agencyComparison';

const AgencyComparison: React.FC = () => {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-semibold mb-4">🏢 Agency Comparison (Approximate)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="py-2 pr-4">Agency</th>
              <th className="py-2 pr-4">Cost $/kg (LEO)</th>
              <th className="py-2 pr-4">Annual Launches</th>
              <th className="py-2 pr-4">Reliability</th>
              <th className="py-2 pr-4">Lead Time</th>
              <th className="py-2 pr-4">Vehicles</th>
            </tr>
          </thead>
          <tbody>
            {agencyComparison.map((a) => (
              <tr key={a.agency} className="border-t border-gray-800">
                <td className="py-2 pr-4 font-medium text-white">{a.agency}</td>
                <td className="py-2 pr-4 text-gray-200">${a.launchCostPerKgUSD.toLocaleString()}</td>
                <td className="py-2 pr-4 text-gray-200">{a.annualLaunches}</td>
                <td className="py-2 pr-4 text-gray-200">{a.reliabilityRatePct}%</td>
                <td className="py-2 pr-4 text-gray-200">{a.typicalLeadTimeMonths} mo</td>
                <td className="py-2 pr-4 text-gray-300">{a.notableVehicles.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Figures are approximate/publicly discussed ballparks and may vary by mission specifics.</p>
    </div>
  );
};

export default AgencyComparison;
