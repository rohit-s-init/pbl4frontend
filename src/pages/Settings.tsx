import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  PhoneCall, 
  Volume2, 
  Save, 
  CheckCircle2,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const settingSections = [
    {
      title: 'Call Preferences',
      icon: PhoneCall,
      color: 'emerald',
      items: [
        { label: 'Voice Accent', value: 'English (US) - Male', type: 'select' },
        { label: 'Speech Speed', value: 'Normal', type: 'select' },
        { label: 'Retry on Failure', value: true, type: 'toggle' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: 'blue',
      items: [
        { label: 'App Notifications', value: true, type: 'toggle' },
        { label: 'Weekly Adherence Report', value: true, type: 'toggle' },
        { label: 'Low Adherence Alerts', value: false, type: 'toggle' },
      ]
    },
    {
      title: 'Appearance',
      icon: Sun,
      color: 'indigo',
      items: [
        { label: 'Dark Mode', value: isDarkMode, type: 'toggle', onChange: () => setIsDarkMode(!isDarkMode) },
        { label: 'Language', value: 'English', type: 'select' },
        { label: 'Font Size', value: 'Large', type: 'select' },
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Settings</h1>
          <p className="text-gray-500 font-medium">Customize your MedCall experience.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-black transition-all hover:bg-red-100"
          >
            <LogOut size={20} />
            Logout
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 font-bold mb-8 animate-bounce">
          <CheckCircle2 size={24} />
          Settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {settingSections.map((section, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                section.color === 'emerald' ? "bg-emerald-600 text-white shadow-emerald-600/20" :
                section.color === 'blue' ? "bg-blue-600 text-white shadow-blue-600/20" :
                "bg-indigo-600 text-white shadow-indigo-600/20"
              )}>
                <section.icon size={24} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{section.title}</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    <div className="flex items-center gap-4">
                      {item.type === 'toggle' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.value as boolean}
                            onChange={item.onChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm cursor-pointer hover:text-emerald-600 transition-colors">
                          {item.value}
                          <ChevronRight size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-800 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center mb-8">
              <Lock className="text-emerald-300" size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-6">Privacy & Security</h3>
            <p className="text-emerald-100/70 text-lg leading-relaxed mb-10">
              Control how your data is used and manage your security preferences. 
              We encrypt all your health data and never share it with third parties.
            </p>
            <button className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black hover:bg-emerald-50 transition-colors shadow-xl shadow-black/20">
              Manage Privacy
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
