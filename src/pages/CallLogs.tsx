import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle2, XCircle, Clock, Search, Filter, Download } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { cn } from '../utils/cn';

export const CallLogs: React.FC = () => {
  const [calls, setCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const data = await api.getCalls();
        setCalls(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalls();
  }, []);

  const filteredCalls = calls!.filter(c => {
    console.log(c);

    return c.twilioSid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.status.toLowerCase().includes(searchTerm.toLowerCase())
  }
  );

  const columns = [
    {
      header: 'Call ID',
      accessor: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            <PhoneCall size={14} />
          </div>
          <span className="font-mono text-xs font-bold text-gray-500">{item.twilioSid}</span>
        </div>
      )
    },
    {
      header: 'Date & Time',
      accessor: (item: any) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (item: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
          item.status === 'completed' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        )}>
          {item.status === 'completed' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {item.status}
        </div>
      )
    },
    {
      header: 'Duration',
      accessor: () => <span className="text-gray-500">0:45s</span>
    },
    {
      header: 'Actions',
      accessor: () => (
        <button className="text-emerald-600 font-bold text-xs hover:underline">
          View Details
        </button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Call Logs</h1>
          <p className="text-gray-500 font-medium">History of all automated reminder calls.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 px-6 py-3 rounded-2xl font-black transition-all shadow-sm group">
          <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by SID or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold text-gray-600 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredCalls}
        isLoading={isLoading}
        emptyMessage="No call logs found."
      />
    </DashboardLayout>
  );
};
