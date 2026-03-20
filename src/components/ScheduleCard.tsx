import React from 'react';
import { Clock, MessageSquare, ToggleLeft, ToggleRight, Edit2, PhoneIncoming, Trash2, Calendar, CalendarClock, Loader } from 'lucide-react';
import { cn } from '../utils/cn';
import { api } from "../services/api"
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"

interface Schedule {
  id: number;
  message: string;
  time: string;
  label: string;
  isActive: boolean;
}

interface ScheduleCardProps {
  schedule: Schedule;
  onToggle: (id: number, isActive: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onToggle, onEdit, onDelete }) => {

  const [isLoading, updateIsLoading] = useState(false);
  // const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [isRunning]);


  async function handleCallReq() {
    updateIsLoading(true);
    const resp = await api.makeCall(schedule.id)
    // const resp: { status: boolean } = await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve({ status: true })
    //   }, 1000);
    // })
    // if (resp.status) {
      updateIsLoading(false);

      updateIsLoading(false);

      setTimer(10);
      setIsRunning(true);

    // }
  }


  return (
    <div className={cn(
      "bg-white rounded-3xl p-6 border-2 transition-all group relative overflow-hidden",
      schedule.isActive ? "border-emerald-100 shadow-xl shadow-emerald-600/5" : "border-gray-100 opacity-75 grayscale-[0.5]"
    )}>
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-110",
        schedule.isActive ? "bg-emerald-600" : "bg-gray-600"
      )} />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
            schedule.isActive ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-gray-100 text-gray-400 shadow-none"
          )}>
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{schedule.time}</h3>
            <span className={cn(
              "text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
              schedule.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            )}>
              {schedule.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => onToggle(schedule.id, !schedule.isActive)}
          className={cn(
            "transition-colors p-1 rounded-lg",
            schedule.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-50"
          )}
        >
          {schedule.isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
        </button>
      </div>

      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex items-start gap-3">
          <MessageSquare className="text-gray-400 mt-1 flex-shrink-0" size={18} />
          <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-2">
            "{schedule.message}"
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="text-gray-400 flex-shrink-0" size={18} />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Daily Reminder</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-50 relative z-10">
        <button
          onClick={() => onEdit(schedule.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => { handleCallReq() }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
        >
          {isLoading ? <Loader size={20} /> : <> {timer == 0 ? <><PhoneIncoming size={16} /> Call</> : timer}</>}
        </button>
        <button
          onClick={() => onDelete(schedule.id)}
          className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={20} />
        </button>

      </div>

    </div>
  );
};


