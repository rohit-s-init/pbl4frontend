import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarClock, 
  PhoneCall, 
  MessageSquareQuote, 
  UserCircle, 
  Settings, 
  LogOut,
  PlusCircle,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CalendarClock, label: 'Schedules', path: '/schedules' },
  { icon: PhoneCall, label: 'Call Logs', path: '/calls' },
  { icon: MessageSquareQuote, label: 'Responses', path: '/responses' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <Bell className="text-white" size={24} />
        </div>
        <span className="text-xl font-black text-emerald-900 tracking-tight">MedCall</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
              isActive 
                ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-emerald-900 rounded-2xl p-4 mb-4 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-800 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">Quick Action</p>
          <p className="text-sm font-medium mb-3 relative z-10">Add a new reminder call</p>
          <NavLink 
            to="/schedules/new"
            className="flex items-center justify-center gap-2 w-full bg-white text-emerald-900 py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors relative z-10"
          >
            <PlusCircle size={16} />
            New Schedule
          </NavLink>
        </div>

        <div className="flex items-center gap-3 p-4 border-t border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
