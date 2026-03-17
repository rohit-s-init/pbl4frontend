import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  Tag, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { api } from '../services/api';
import { cn } from '../utils/cn';

export const ScheduleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    message: '',
    time: '08:00',
    label: 'Morning',
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchSchedule = async () => {
        try {
          const schedules = await api.getSchedules();
          const schedule = schedules.find((s: any) => s.id === Number(id));
          if (schedule) {
            setFormData({
              message: schedule.message,
              time: schedule.time,
              label: schedule.label,
              isActive: schedule.isActive,
            });
          } else {
            setError('Schedule not found');
          }
        } catch (err) {
          setError('Failed to fetch schedule');
        } finally {
          setIsFetching(false);
        }
      };
      fetchSchedule();
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      if (isEdit) {
        await api.updateSchedule(Number(id), formData);
      } else {
        await api.createSchedule(formData);
      }
      setSuccess(true);
      setTimeout(() => navigate('/schedules'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save schedule');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <DashboardLayout><Loader2 className="animate-spin mx-auto mt-20" size={48} /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/schedules')}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Schedules
        </button>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
          <div className="p-10 border-b border-gray-50 bg-emerald-50/30">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              {isEdit ? 'Edit Schedule' : 'Create New Schedule'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isEdit ? 'Update your reminder call details.' : 'Set up a new automated voice call reminder.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {success && (
              <div className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 font-bold animate-bounce">
                <CheckCircle2 size={24} />
                Schedule saved successfully! Redirecting...
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-2xl flex items-center gap-3 font-bold">
                <AlertCircle size={24} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare size={14} />
                Voice Message (Text to be spoken)
              </label>
              <textarea 
                name="message"
                rows={3}
                placeholder="e.g., Hello Rohit, it's time for your morning medicine. Please take it now." 
                value={formData.message}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium text-lg resize-none"
              />
              <p className="text-xs text-gray-400 italic ml-1">This text will be read aloud by our automated voice system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={14} />
                  Call Time
                </label>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-black text-2xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag size={14} />
                  Label / Category
                </label>
                <select 
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg appearance-none cursor-pointer"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex-1">
                <h4 className="font-black text-gray-900 mb-1">Active Status</h4>
                <p className="text-sm text-gray-500 font-medium">Enable or disable this reminder call.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/schedules')}
                className="flex-1 py-4 rounded-2xl font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 text-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Save size={24} />
                    {isEdit ? 'Update Schedule' : 'Save Schedule'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
