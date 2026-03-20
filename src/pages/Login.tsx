import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Bell, HeartPulse, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { OTPModal } from '../components/OTPModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone != "+918459781390") {
      alert("Hey there, we are running on a free trial so you cant register directly, contact the team for craeting your trial account");
      return;
    }



    if (!phone) {
      setError('Please fill valid mobile no');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.sendOtp(phone);
      setIsOtpModalOpen(true);
    } catch (err: any) {
      console.log(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!(phone as string).startsWith("+91")) {
      setPhone((prev: string) => ("+91" + prev));
    }
  },[phone]);

  const handleVerifyOtp = async (otp: string) => {
    console.log("inside login onVerify")

    const result = await api.verifyOtpLogin(phone, otp);
    if (result.success) {
      login(result.user);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-900 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-800 rounded-full opacity-30 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <Bell className="text-emerald-900" size={28} />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">MedCall</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8"
          >
            Medicine reminders <br />
            <span className="text-emerald-400 italic">via voice calls.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-100/70 text-xl max-w-md leading-relaxed mb-12"
          >
            The simplest way for seniors to stay on track with their health.
            No apps, no notifications—just a friendly phone call.
          </motion.p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-emerald-900/40 backdrop-blur-md border border-emerald-800/50 p-6 rounded-3xl">
              <HeartPulse className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-white font-bold mb-1">Health First</h3>
              <p className="text-emerald-200/60 text-sm">Automated tracking for better adherence.</p>
            </div>
            <div className="bg-emerald-900/40 backdrop-blur-md border border-emerald-800/50 p-6 rounded-3xl">
              <ShieldCheck className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-white font-bold mb-1">Secure & Private</h3>
              <p className="text-emerald-200/60 text-sm">Your data and privacy are our priority.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-12 border-t border-emerald-800/50">
          <p className="text-emerald-400/60 text-sm font-bold uppercase tracking-widest">Trusted by 10,000+ patients</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 bg-white p-8 lg:p-24 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Enter your phone number to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl transition-all outline-none text-lg font-bold",
                    error ? "border-red-100 focus:border-red-500" : "border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  )}
                />
              </div>
              {error && <p className="text-red-500 text-sm font-bold ml-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 text-lg group disabled:opacity-70"
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  Login
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-12 text-gray-500 font-medium">
            New to MedCall?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-emerald-600 font-black hover:underline underline-offset-4"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        phone={phone}
      />
    </div>
  );
};
