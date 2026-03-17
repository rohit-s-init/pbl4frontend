import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  MessageSquare,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSchedules: 0,
    activeSchedules: 0,
    totalCalls: 0,
    successfulCalls: 0,
    complianceRate: 0,
  });
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedules, calls, responses] = await Promise.all([
          api.getSchedules(),
          api.getCalls(),
          api.getResponses(),
        ]);

        const activeSchedules = schedules.filter((s: any) => s.isActive).length;
        const successfulCalls = calls.filter((c: any) => c.status === 'completed').length;
        const yesResponses = responses.filter((r: any) => r.interpretedIntent === 'YES').length;
        
        setStats({
          totalSchedules: schedules.length,
          activeSchedules,
          totalCalls: calls.length,
          successfulCalls,
          complianceRate: calls.length > 0 ? Math.round((yesResponses / calls.length) * 100) : 0,
        });

        setRecentCalls(calls.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <DashboardLayout><Loader size={48} /></DashboardLayout>;

  const statCards = [
    { label: 'Active Schedules', value: stats.activeSchedules, icon: Calendar, color: 'emerald', trend: '+2 this week' },
    { label: 'Total Calls', value: stats.totalCalls, icon: PhoneCall, color: 'blue', trend: 'Last 30 days' },
    { label: 'Compliance Rate', value: `${stats.complianceRate}%`, icon: TrendingUp, color: 'indigo', trend: 'Very Good' },
    { label: 'Successful Calls', value: stats.successfulCalls, icon: CheckCircle2, color: 'emerald', trend: '98% success' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Health Dashboard</h1>
        <p className="text-gray-500 font-medium">Welcome back! Here's a summary of your medication adherence.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                stat.color === 'emerald' ? "bg-emerald-600 text-white shadow-emerald-600/20" :
                stat.color === 'blue' ? "bg-blue-600 text-white shadow-blue-600/20" :
                "bg-indigo-600 text-white shadow-indigo-600/20"
              )}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                <Activity size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Call Activity</h2>
            </div>
            <NavLink to="/calls" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </NavLink>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      call.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}>
                      {call.status === 'completed' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {call.status === 'completed' ? 'Successful Call' : 'Call Failed'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(call.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      call.status === 'completed' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {call.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips / Health Info */}
        <div className="space-y-6">
          <div className="bg-emerald-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-800 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="text-emerald-300" size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4">Voice Responses</h3>
              <p className="text-emerald-100/70 text-sm leading-relaxed mb-8">
                You can respond to calls with simple words like "Yes", "No", or "Not yet". 
                Our AI will interpret your intent and record it.
              </p>
              <NavLink 
                to="/responses"
                className="inline-flex items-center gap-2 bg-white text-emerald-900 px-6 py-3 rounded-xl text-sm font-black hover:bg-emerald-50 transition-colors"
              >
                View Responses
                <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Next Reminder</h3>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Scheduled For</p>
              <p className="text-3xl font-black text-emerald-900 mb-1">08:00 PM</p>
              <p className="text-sm font-bold text-gray-600">Evening Dose</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
