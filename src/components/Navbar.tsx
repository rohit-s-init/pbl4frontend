import React from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const { user, credits : callsAval } = useAuth();


  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search schedules, logs, or settings..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <NavLink
          to="/schedules/new"
          className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} />
          New Schedule
        </NavLink>

        <button className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell size={22} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        </button>

        {/* <div className="h-10 w-px bg-gray-100 mx-2" /> */}

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">{callsAval} calls avaliable</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-emerald-50 shadow-sm">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
