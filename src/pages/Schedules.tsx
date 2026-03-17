import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CalendarClock } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ScheduleCard } from '../components/ScheduleCard';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const Schedules: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await api.updateSchedule(id, { isActive });
      setSchedules(prev => prev.map(s => s.id === id ? { ...s, isActive } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await api.deleteSchedule(id);
        setSchedules(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredSchedules = schedules.filter(s => 
    s.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Reminder Schedules</h1>
          <p className="text-gray-500 font-medium">Manage your automated voice call reminders.</p>
        </div>
        <button 
          onClick={() => navigate('/schedules/new')}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20 group"
        >
          <Plus className="group-hover:rotate-90 transition-transform" size={24} />
          Create New Schedule
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by message or label..." 
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

      {isLoading ? (
        <Loader size={48} />
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8">
            <CalendarClock size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No schedules found</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
            You haven't created any reminder schedules yet. Start by creating your first one!
          </p>
          <button 
            onClick={() => navigate('/schedules/new')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20"
          >
            Create Your First Schedule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredSchedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ScheduleCard 
                  schedule={schedule}
                  onToggle={handleToggle}
                  onEdit={(id) => navigate(`/schedules/edit/${id}`)}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
};
