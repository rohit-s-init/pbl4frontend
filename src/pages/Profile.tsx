import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Save, Loader2, CheckCircle2, LogOut } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export const Profile: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await api.updateProfile(formData);
      login(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <DashboardLayout><Loader2 className="animate-spin mx-auto mt-20" size={48} /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Profile</h1>
          <p className="text-gray-500 font-medium">Manage your personal information and account settings.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
            <div className="p-10 border-b border-gray-50 bg-emerald-50/30 flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-600/20">
                {formData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{formData.name}</h2>
                <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mt-1">Patient Member</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {success && (
                <div className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 font-bold">
                  <CheckCircle2 size={24} />
                  Profile updated successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={14} />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Phone size={14} />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg"
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 text-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Save size={24} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-800 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-emerald-300" size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4">Security Status</h3>
              <p className="text-emerald-100/70 text-sm leading-relaxed mb-6">
                Your account is protected with two-factor authentication (OTP). 
                Keep your phone number updated to ensure you never miss a reminder.
              </p>
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 size={16} />
                Verified Account
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6">Account Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm font-bold text-gray-500">Member Since</span>
                <span className="text-sm font-black text-gray-900">March 2026</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm font-bold text-gray-500">Total Reminders</span>
                <span className="text-sm font-black text-gray-900">428</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm font-bold text-gray-500">Success Rate</span>
                <span className="text-sm font-black text-emerald-600">98.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
