import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Performance Reports & Audit Logs
          </h1>
          <p className="text-xs text-[#a7adc0] mt-1">
            Analyze realtor response conversion rates, channel performance, AI grading accuracy, and system audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#070811] border border-[#202641] text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#7c5cfc]"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
          </select>

          <button
            onClick={() => alert('Simulated CSV Export downloaded: performance_report_q3.csv')}
            className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7c5cfc]/20 transition-all"
          >
            Export Report CSV
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="executive-panel rounded-2xl p-4">
          <div className="text-[10px] uppercase font-bold text-[#737b91]">Total SMS Sent</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">12,490</div>
          <div className="text-[11px] text-[#35b77a] mt-1">↑ 14% vs last period</div>
        </div>

        <div className="executive-panel rounded-2xl p-4">
          <div className="text-[10px] uppercase font-bold text-[#737b91]">Email Touchpoints</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">8,120</div>
          <div className="text-[11px] text-[#35b77a] mt-1">↑ 8% vs last period</div>
        </div>

        <div className="executive-panel rounded-2xl p-4">
          <div className="text-[10px] uppercase font-bold text-[#737b91]">Avg Realtor Response Time</div>
          <div className="text-2xl font-bold text-[#9b8afb] font-mono mt-1">14 Mins</div>
          <div className="text-[11px] text-[#a7adc0] mt-1">AI bot responds in &lt; 2s</div>
        </div>

        <div className="executive-panel rounded-2xl p-4">
          <div className="text-[10px] uppercase font-bold text-[#737b91]">Deals Underwriting Conversion</div>
          <div className="text-2xl font-bold text-[#35b77a] font-mono mt-1">4.2%</div>
          <div className="text-[11px] text-[#a7adc0] mt-1">High conversion in DFW North</div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="executive-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Compliance System Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202641] text-[#737b91] uppercase tracking-wider text-[10px] bg-[#070811]">
                <th className="py-2.5 px-3">Actor / User</th>
                <th className="py-2.5 px-3">Action Executed</th>
                <th className="py-2.5 px-3">Affected Record</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202641] text-slate-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#171c33]/40 transition-colors font-mono text-[11px]">
                  <td className="py-3 px-3 text-[#9b8afb] font-bold">{log.actor}</td>
                  <td className="py-3 px-3 text-slate-200">{log.action}</td>
                  <td className="py-3 px-3 text-[#a7adc0]">{log.affectedRecord}</td>
                  <td className="py-3 px-3 text-right text-[#737b91]">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
