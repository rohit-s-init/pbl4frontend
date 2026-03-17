import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { OTPModal } from '../components/OTPModal';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.sendOtp(formData.phone);
      setIsOtpModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const result = await api.verifyOtp(formData.phone, otp, formData);
    if (result.success) {
      login(result.user);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Info */}
        <div className="md:w-2/5 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500 rounded-full opacity-50" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-700 rounded-full opacity-50" />
          
          <div className="relative z-10">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-emerald-100 font-bold hover:text-white transition-colors mb-12"
            >
              <ArrowLeft size={20} />
              Back to Login
            </button>
            <h2 className="text-4xl font-black tracking-tight mb-6">Join MedCall</h2>
            <p className="text-emerald-100 font-medium leading-relaxed">
              Start your journey to better health management with automated voice reminders.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-300" size={20} />
              <span className="text-sm font-bold">Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-300" size={20} />
              <span className="text-sm font-bold">No credit card required</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-12 lg:p-16">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Create Account</h3>
            <p className="text-gray-500 font-medium">It only takes a minute to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="+91 98765 43210" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold ml-1">{error}</p>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 text-lg group disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-400 text-sm font-medium">
            By signing up, you agree to our{' '}
            <button className="text-emerald-600 hover:underline">Terms of Service</button>
          </p>
        </div>
      </motion.div>

      <OTPModal 
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        phone={formData.phone}
      />
    </div>
  );
};
