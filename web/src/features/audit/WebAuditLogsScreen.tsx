import React, { useState } from 'react';
import { useAuditLogs } from '../../hooks/useDonationQueries';
import { formatDate } from '../../utils/formatters';
import { History, ShieldCheck, Search } from '../../utils/icons';

export const WebAuditLogsScreen: React.FC = () => {
  const { data: logs = [], isLoading } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.performedByName && log.performedByName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History size={24} color="#818cf8" />
            <span>Immutable System Audit Log</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Complete audit trail tracking all donation additions, expense approvals, user role changes, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-bold shrink-0">
          <ShieldCheck size={16} />
          <span>Atomic JSON Safety Active</span>
        </div>
      </div>

      {/* Log Table Container */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Log Trajectory Records ({logs.length})</h3>

          <div className="relative w-80">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by action, user, entity ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-amber-300 animate-pulse">
            Loading audit records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Payload Snapshot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                      No audit entries found matching search query.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{log.id}</td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700/60 text-[10px] font-bold text-indigo-300 uppercase">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-200 font-semibold">
                        {log.entityType}
                        <span className="block text-[10px] text-slate-400 font-normal">{log.entityId}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {log.performedByName || log.performedBy}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">{formatDate(log.timestamp)}</td>

                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 max-w-xs truncate">
                        {log.newValue ? JSON.stringify(log.newValue) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
