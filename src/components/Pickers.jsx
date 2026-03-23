import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';

export const GlassDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef();
  useEffect(() => {
    const handleClick = (e) => { if (calendarRef.current && !calendarRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClick); return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const now = new Date(value || Date.now());
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  return (
    <div className="relative w-full" ref={calendarRef}>
      <div className="w-full glow-border rounded-xl px-5 py-3.5 text-white flex justify-between items-center cursor-pointer select-none transition-all hover:bg-white/5 active:scale-[0.98]" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-semibold">{value ? value.split('-').reverse().join('/') : 'Select Date'}</span>
        <Calendar className="w-4 h-4 text-[#888]" />
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-[#1c1c1e]/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-[10px] font-bold text-[#888] uppercase text-center mb-2">{d}</div>)}
            {Array.from({ length: first }).map((_, i) => <div key={i} />)}
            {Array.from({ length: days }).map((_, i) => {
              const d = i + 1; const m = String(now.getMonth() + 1).padStart(2, '0'); const day = String(d).padStart(2, '0');
              const sel = value === `${now.getFullYear()}-${m}-${day}`;
              return <button key={d} onClick={() => { onChange(`${now.getFullYear()}-${m}-${day}`); setIsOpen(false); }} className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${sel ? 'bg-white text-black shadow-md' : 'text-white hover:bg-white/20'}`}>{d}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const GlassTimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeRef = useRef();
  useEffect(() => {
    const handleClick = (e) => { if (timeRef.current && !timeRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClick); return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const h12 = (h) => (h % 12 || 12);
  const format = () => { if (!value) return 'Select Time'; const [h, m] = value.split(':'); return `${String(h12(h)).padStart(2, '0')}:${m} ${parseInt(h) >= 12 ? 'PM' : 'AM'}`; };
  return (
    <div className="relative w-full" ref={timeRef}>
      <div className="w-full glow-border rounded-xl px-5 py-3.5 text-white flex justify-between items-center cursor-pointer select-none transition-all hover:bg-white/5 active:scale-[0.98]" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-semibold">{format()}</span>
        <Clock className="w-4 h-4 text-[#888]" />
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-56 h-52 bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 flex gap-1 hide-scrollbars animate-in fade-in zoom-in duration-200">
          <div className="flex-1 overflow-y-auto hide-scrollbars relative snap-y">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} onClick={() => { let [h, m] = value.split(':'); onChange(`${String(i + 1 + (parseInt(h) >= 12 ? 12 : 0)).padStart(2, '0')}:${m}`); }} className={`snap-center text-center py-2 rounded-xl cursor-pointer text-sm font-bold transition-colors ${h12(value.split(':')[0]) === (i + 1) ? 'bg-white text-black' : 'text-[#bbb] hover:text-white'}`}>{String(i + 1).padStart(2, '0')}</div>)}
          </div>
          <div className="flex-1 overflow-y-auto hide-scrollbars relative snap-y border-x border-white/5">
            {Array.from({ length: 60 }).map((_, i) => <div key={i} onClick={() => { let [h, m] = value.split(':'); onChange(`${h}:${String(i).padStart(2, '0')}`); }} className={`snap-center text-center py-2 rounded-xl cursor-pointer text-sm font-bold transition-colors ${parseInt(value.split(':')[1]) === i ? 'bg-white text-black' : 'text-[#bbb] hover:text-white'}`}>{String(i).padStart(2, '0')}</div>)}
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 pl-1">
            <div onClick={() => { let [h, m] = value.split(':'); let H = parseInt(h); if (H >= 12) H -= 12; onChange(`${String(H).padStart(2, '0')}:${m}`); }} className={`text-center py-3 rounded-xl cursor-pointer text-xs font-black ${parseInt(value.split(':')[0]) < 12 ? 'bg-white text-black' : 'text-[#888] bg-white/5'}`}>AM</div>
            <div onClick={() => { let [h, m] = value.split(':'); let H = parseInt(h); if (H < 12) H += 12; onChange(`${String(H).padStart(2, '0')}:${m}`); }} className={`text-center py-3 rounded-xl cursor-pointer text-xs font-black ${parseInt(value.split(':')[0]) >= 12 ? 'bg-white text-black' : 'text-[#888] bg-white/5'}`}>PM</div>
          </div>
        </div>
      )}
    </div>
  );
};
