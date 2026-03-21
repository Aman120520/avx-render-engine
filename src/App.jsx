import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Calendar, Clock, RefreshCw, CheckCircle2, Sparkles, ChevronRight, Aperture } from 'lucide-react';

const GlassDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value || Date.now()));
  const calendarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const handleDateClick = (day) => {
    const formattedMonth = String(viewDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${viewDate.getFullYear()}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const formatDisplayDate = (dateString) => {
     if(!dateString) return "Select Date";
     const [y, m, d] = dateString.split('-');
     return `${d}/${m}/${y}`;
  };

  return (
    <div className="relative w-full" ref={calendarRef}>
       <div 
         className="w-full glow-border rounded-xl px-5 py-3.5 text-white flex justify-between items-center cursor-pointer select-none transition-all hover:bg-white/5 active:scale-[0.98]"
         onClick={() => setIsOpen(!isOpen)}
       >
         <span className="font-semibold">{formatDisplayDate(value)}</span>
         <Calendar className="w-4 h-4 text-[#888]" />
       </div>
       
       {isOpen && (
         <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-[#1c1c1e]/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50">
            <div className="flex justify-between items-center mb-5 text-white">
              <button type="button" onClick={prevMonth} className="p-1 px-3 hover:bg-white/15 rounded-lg transition-colors bg-white/5 font-bold">&lsaquo;</button>
              <span className="font-bold text-sm tracking-wide">
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button type="button" onClick={nextMonth} className="p-1 px-3 hover:bg-white/15 rounded-lg transition-colors bg-white/5 font-bold">&rsaquo;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-[10px] font-bold text-[#888] uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                 const day = i + 1;
                 const checkMonth = String(viewDate.getMonth() + 1).padStart(2, '0');
                 const checkDay = String(day).padStart(2, '0');
                 const isSelected = value === `${viewDate.getFullYear()}-${checkMonth}-${checkDay}`;
                 return (
                   <button 
                     type="button"
                     key={day} 
                     onClick={() => handleDateClick(day)}
                     className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                       isSelected ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-white hover:bg-white/20'
                     }`}
                   >
                     {day}
                   </button>
                 );
              })}
            </div>
         </div>
       )}
    </div>
  );
};

const GlassTimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (timeRef.current && !timeRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatDisplayTime = () => {
     if(!value) return "Select Time";
     const [h, m] = value.split(':');
     const H = parseInt(h);
     const ampm = H >= 12 ? 'PM' : 'AM';
     const h12 = H % 12 || 12;
     return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
  };

  const handleTimeChange = (type, val) => {
     let [h, m] = value.split(':');
     let H = parseInt(h);
     if (type === 'H') {
       const isPmNow = H >= 12;
       H = val % 12;
       if (isPmNow) H += 12;
     } else if (type === 'M') {
       m = String(val).padStart(2, '0');
     } else if (type === 'AMPM') {
       if (val === 'PM' && H < 12) H += 12;
       if (val === 'AM' && H >= 12) H -= 12;
     }
     onChange(`${String(H).padStart(2, '0')}:${m}`);
  };

  const currentH = value ? parseInt(value.split(':')[0]) : 9;
  const hour12 = currentH % 12 || 12;
  const currentM = value ? parseInt(value.split(':')[1]) : 15;
  const isPM = currentH >= 12;

  // Jump to minutes manually or gently scroll
  return (
    <div className="relative w-full" ref={timeRef}>
       <div 
         className="w-full glow-border rounded-xl px-5 py-3.5 text-white flex justify-between items-center cursor-pointer select-none transition-all hover:bg-white/5 active:scale-[0.98]"
         onClick={() => setIsOpen(!isOpen)}
       >
         <span className="font-semibold">{formatDisplayTime()}</span>
         <Clock className="w-4 h-4 text-[#888]" />
       </div>
       
       {isOpen && (
         <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 flex gap-1 h-52 hide-scrollbars">
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 hide-scrollbars relative snap-y">
               {Array.from({length: 12}).map((_, i) => {
                 const hr = i + 1;
                 const selected = hr === hour12;
                 return (
                   <div key={hr} onClick={() => handleTimeChange('H', hr)} className={`snap-center text-center py-2 rounded-xl cursor-pointer text-sm font-bold transition-colors ${selected ? 'bg-white text-black shadow-md' : 'text-[#bbb] hover:text-white hover:bg-white/10'}`}>
                     {String(hr).padStart(2, '0')}
                   </div>
                 );
               })}
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 px-1 border-x border-white/5 hide-scrollbars relative snap-y">
               {Array.from({length: 60}).map((_, i) => {
                 const selected = i === currentM;
                 return (
                   <div key={i} onClick={() => handleTimeChange('M', i)} className={`snap-center text-center py-2 rounded-xl cursor-pointer text-sm font-bold transition-colors ${selected ? 'bg-white text-black shadow-md' : 'text-[#bbb] hover:text-white hover:bg-white/10'}`}>
                     {String(i).padStart(2, '0')}
                   </div>
                 );
               })}
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-2 pl-1">
               <div onClick={() => handleTimeChange('AMPM', 'AM')} className={`text-center py-3 rounded-xl cursor-pointer text-sm font-black transition-colors ${!isPM ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-[#888] bg-white/5 hover:text-white hover:bg-white/10'}`}>AM</div>
               <div onClick={() => handleTimeChange('AMPM', 'PM')} className={`text-center py-3 rounded-xl cursor-pointer text-sm font-black transition-colors ${isPM ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-[#888] bg-white/5 hover:text-white hover:bg-white/10'}`}>PM</div>
            </div>
         </div>
       )}
    </div>
  );
};


export default function App() {
  const LAYOUT = {
    photoX: 26.5,
    photoY: 48.0,
    photoRadius: 19.5,
    textX: 72.0,
    textY: 40.0
  };

  const [formData, setFormData] = useState(() => {
    const d = new Date();
    const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const localTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return {
      parentsName: '',
      date: localDate,
      time: localTime,
      gender: 'male',
      weight: '2.100',
      package: 'Gold'
    };
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Force load the exact Satoshi font from Fontshare
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBabyImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- HTML5 CANVAS GENERATION LOGIC ---
  const drawCloud = (ctx, x, y, scale) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.beginPath();
    ctx.arc(0, 0, 20, Math.PI * 0.5, Math.PI * 1.5); ctx.arc(25, -15, 25, Math.PI * 1, Math.PI * 2);
    ctx.arc(60, -10, 20, Math.PI * 1.2, Math.PI * 2); ctx.arc(80, 5, 15, Math.PI * 1.5, Math.PI * 0.5);
    ctx.lineTo(0, 20); ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
  };

  const drawClippedImage = (ctx, img, cx, cy, radius) => {
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
    const imgAspect = img.width / img.height;
    let sWidth = img.width, sHeight = img.height, sX = 0, sY = 0;
    if (imgAspect > 1) { sWidth = img.height; sX = (img.width - img.height) / 2; }
    else { sHeight = img.width; sY = (img.height - img.width) / 2; }
    ctx.drawImage(img, sX, sY, sWidth, sHeight, cx - radius, cy - radius, radius * 2, radius * 2); ctx.restore();
  };

  const generateClassic = async (babyImg, isBoy) => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800; const ctx = canvas.getContext('2d');
    const grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 900);
    grd.addColorStop(0, '#FFFFFF'); grd.addColorStop(1, isBoy ? '#D5EDFF' : '#FFDDF0');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let x = 0; x < canvas.width; x += 50) { for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.arc(x + (y % 100 === 0 ? 25 : 0), y, 10, 0, Math.PI * 2); ctx.fill(); } }
    ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
    const bannerColor = isBoy ? '#0A3B8C' : '#C21B66'; ctx.fillStyle = bannerColor;
    ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(400, 40); ctx.lineTo(350, 110); ctx.lineTo(0, 110); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.fillStyle = isBoy ? '#052254' : '#7D0B3E';
    ctx.beginPath(); ctx.moveTo(0, 110); ctx.lineTo(20, 130); ctx.lineTo(20, 110); ctx.fill();
    const goldGrd = ctx.createLinearGradient(0, 50, 0, 100); goldGrd.addColorStop(0, '#FFF5C3'); goldGrd.addColorStop(0.5, '#FFD700'); goldGrd.addColorStop(1, '#B8860B');
    ctx.fillStyle = isBoy ? goldGrd : '#FFFFFF'; ctx.font = 'italic 900 44px "Georgia", serif'; ctx.fillText('Congratulations', 30, 92);
    drawCloud(ctx, 100, 10, 1.5); drawCloud(ctx, 750, 120, 1.2); drawCloud(ctx, 950, 60, 0.8); drawCloud(ctx, 800, 720, 1.4); drawCloud(ctx, 550, 680, 1);
    ctx.lineWidth = 2; ctx.strokeStyle = isBoy ? '#8AB4F8' : '#F48FB1'; ctx.beginPath(); ctx.moveTo(400, 0); ctx.quadraticCurveTo(650, 100, 900, 0); ctx.stroke();
    const flagColors = isBoy ? ['#8AB4F8', '#FFFFFF', '#4285F4'] : ['#F48FB1', '#FFFFFF', '#EC407A'];
    for (let i = 1; i <= 6; i++) { const t = i / 7; const fx = 400 * (1 - t) * (1 - t) + 2 * 650 * (1 - t) * t + 900 * t * t; const fy = 0 * (1 - t) * (1 - t) + 2 * 100 * (1 - t) * t + 0 * t * t; ctx.fillStyle = flagColors[i % 3]; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx - 18, fy + 55); ctx.lineTo(fx + 18, fy + 55); ctx.fill(); }
    const cx = canvas.width * (LAYOUT.photoX / 100), cy = canvas.height * (LAYOUT.photoY / 100), radius = canvas.width * (LAYOUT.photoRadius / 100);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = 25; ctx.shadowOffsetY = 15; ctx.fillStyle = isBoy ? '#BEE0FD' : '#F9CDE7';
    for (let i = 0; i < 28; i++) { const angle = (i / 28) * Math.PI * 2; ctx.beginPath(); ctx.arc(cx + Math.cos(angle) * (radius + 8), cy + Math.sin(angle) * (radius + 8), 32, 0, Math.PI * 2); ctx.fill(); }
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2); ctx.fill();
    drawClippedImage(ctx, babyImg, cx, cy, radius);
    ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 8; ctx.fillStyle = bannerColor;
    ctx.beginPath(); ctx.moveTo(cx - 190, cy + radius + 35); ctx.lineTo(cx + 190, cy + radius + 35); ctx.lineTo(cx + 170, cy + radius + 65); ctx.lineTo(cx + 190, cy + radius + 95); ctx.lineTo(cx - 190, cy + radius + 95); ctx.lineTo(cx - 170, cy + radius + 65); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#FFFFFF'; ctx.font = '900 30px "Satoshi", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`It's a Baby ${isBoy ? 'Boy' : 'Girl'}!`, cx, cy + radius + 75);
    ctx.font = '70px sans-serif'; ctx.fillText('👣', 550, 620); ctx.fillText(isBoy ? '🧸' : '🦄', 700, 250); ctx.fillText('🍼', 1050, 160); ctx.font = '160px sans-serif'; ctx.fillText(isBoy ? '🐘' : '🐰', 1000, 820);
    const textCx = canvas.width * (LAYOUT.textX / 100); const textStartY = canvas.height * (LAYOUT.textY / 100); const textColor = isBoy ? '#124B8B' : '#C21B66'; ctx.textAlign = 'center'; ctx.fillStyle = textColor;
    const nameParts = formData.parentsName.trim().toUpperCase().split(' '); let line1 = "TO, ", line2 = "& FAMILY";
    if (nameParts.length === 1) { line1 += nameParts[0] || ''; } else { let splitIdx = 1; let minDiff = Infinity; for (let i = 1; i < nameParts.length; i++) { const diff = Math.abs(("TO, " + nameParts.slice(0, i).join(' ')).length - (nameParts.slice(i).join(' ') + " & FAMILY").length); if (diff < minDiff) { minDiff = diff; splitIdx = i; } } line1 = "TO, " + nameParts.slice(0, splitIdx).join(' '); line2 = nameParts.slice(splitIdx).join(' ') + " & FAMILY"; }
    const drawFittedTextCenter = (text, y, baseSize, maxW) => { let size = baseSize; ctx.font = `900 ${size}px "Satoshi", sans-serif`; while (ctx.measureText(text).width > maxW && size > 16) { size -= 1; ctx.font = `900 ${size}px "Satoshi", sans-serif`; } ctx.fillText(text, textCx, y); };
    drawFittedTextCenter(line1, textStartY, canvas.width * 0.038, 500); drawFittedTextCenter(line2, textStartY + (canvas.height * 0.075), canvas.width * 0.038, 500);
    ctx.fillStyle = isBoy ? '#2A6AB3' : '#D63378'; ctx.font = `italic 500 ${canvas.width * 0.026}px "Georgia", serif`; ctx.fillText('“Warm Welcome for child with Lots of', textCx, textStartY + (canvas.height * 0.18)); ctx.fillText('Love & Greetings”', textCx, textStartY + (canvas.height * 0.23));
    const statsBoxColor = isBoy ? 'rgba(213, 237, 255, 0.85)' : 'rgba(255, 221, 240, 0.85)'; const statsBorderColor = isBoy ? 'rgba(18, 75, 139, 0.15)' : 'rgba(194, 27, 102, 0.15)';
    ctx.fillStyle = statsBoxColor; ctx.strokeStyle = statsBorderColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(textCx - (canvas.width * 0.30), textStartY + (canvas.height * 0.32), canvas.width * 0.60, canvas.height * 0.07, 30); ctx.fill(); ctx.stroke();
    ctx.fillStyle = textColor; ctx.font = `bold ${canvas.width * 0.017}px "Satoshi", sans-serif`; ctx.fillText(`📅  ${formData.date}    ⏰  ${formData.time}    ⚖️  ${formData.weight} Kg    🎁  Pkg: ${formData.package}`, textCx, textStartY + (canvas.height * 0.368), 650);
    return canvas.toDataURL('image/jpeg', 1.0);
  };

  const generateMinimalist = async (babyImg, isBoy) => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800; const ctx = canvas.getContext('2d');
    ctx.fillStyle = isBoy ? '#F0F4F8' : '#FFF0F5'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isBoy ? '#E1EBF5' : '#FFE4ED'; ctx.beginPath(); ctx.arc(0, 800, 400, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(1200, 0, 300, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(100, 100, 450, 600, 20); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.save(); ctx.beginPath(); ctx.roundRect(120, 120, 410, 410, 10); ctx.clip(); const imgAspect = babyImg.width / babyImg.height; let sW = babyImg.width, sH = babyImg.height, sX = 0, sY = 0; if (imgAspect > 1) { sW = babyImg.height; sX = (babyImg.width - babyImg.height) / 2; } else { sH = babyImg.width; sY = (babyImg.height - babyImg.width) / 2; } ctx.drawImage(babyImg, sX, sY, sW, sH, 120, 120, 410, 410); ctx.restore();
    ctx.fillStyle = isBoy ? '#475569' : '#831843'; ctx.font = 'italic 24px "Georgia", serif'; ctx.textAlign = 'center'; ctx.fillText('A Beautiful Blessing', 325, 600); ctx.font = 'bold 36px "Satoshi", sans-serif'; ctx.fillText(`IT'S A ${isBoy ? 'BOY' : 'GIRL'}!`, 325, 650);
    ctx.textAlign = 'left'; ctx.fillStyle = isBoy ? '#1E293B' : '#4C0519'; ctx.font = '900 64px "Satoshi", sans-serif'; ctx.fillText('WELCOME', 620, 250); ctx.fillStyle = isBoy ? '#3B82F6' : '#E11D48'; ctx.font = '600 32px "Satoshi", sans-serif'; ctx.fillText('TO THE FAMILY', 625, 290);
    ctx.fillStyle = '#64748B'; ctx.font = 'italic 28px "Georgia", serif'; ctx.fillText(`Warmest congratulations to:`, 620, 380); ctx.fillStyle = isBoy ? '#0F172A' : '#4C0519';
    const words = formData.parentsName.trim().toUpperCase().split(' '); let splitIdx = Math.ceil(words.length / 2) || 1; let minDiff = Infinity; if (words.length > 1) { for (let i = 1; i < words.length; i++) { const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length); if (diff < minDiff) { minDiff = diff; splitIdx = i; } } }
    const drawFittedTextMin = (text, y, baseSize, maxW) => { let size = baseSize; ctx.font = `900 ${size}px "Satoshi", sans-serif`; while (ctx.measureText(text).width > maxW && size > 16) { size -= 2; ctx.font = `900 ${size}px "Satoshi", sans-serif`; } ctx.fillText(text, 620, y); };
    drawFittedTextMin(words.slice(0, splitIdx).join(' '), 430, 40, 500); drawFittedTextMin(words.slice(splitIdx).join(' '), 480, 40, 500);
    ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.05)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5; ctx.beginPath(); ctx.roundRect(620, 540, 480, 160, 20); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#64748B'; ctx.font = '600 16px uppercase tracking-widest sans-serif'; ctx.fillText('DATE', 660, 580); ctx.fillText('TIME', 900, 580); ctx.fillText('WEIGHT', 660, 650); ctx.fillText('PACKAGE', 900, 650);
    ctx.fillStyle = isBoy ? '#1E293B' : '#4C0519'; ctx.font = 'bold 24px "Satoshi", sans-serif'; ctx.fillText(formData.date, 660, 610); ctx.fillText(formData.time, 900, 610); ctx.fillText(`${formData.weight} KG`, 660, 680); ctx.fillText(formData.package, 900, 680);
    return canvas.toDataURL('image/jpeg', 1.0);
  };

  const generateVibrant = async (babyImg, isBoy) => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800; const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 1200, 800); grd.addColorStop(0, isBoy ? '#38BDF8' : '#F472B6'); grd.addColorStop(1, isBoy ? '#0284C7' : '#BE185D'); ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(100, 100, 300, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(1100, 700, 400, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(600, 400, 600, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(850, 400, 280, 0, Math.PI * 2); ctx.fill(); ctx.shadowColor = 'transparent';
    drawClippedImage(ctx, babyImg, 850, 400, 265);
    ctx.textAlign = 'left'; ctx.fillStyle = '#FFFFFF'; ctx.font = '900 80px "Satoshi", sans-serif'; ctx.fillText(`IT'S A ${isBoy ? 'BOY' : 'GIRL'}!`, 80, 220);
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'italic 600 30px "Georgia", serif'; ctx.fillText(`Welcome to the world,`, 80, 280);
    ctx.fillStyle = '#FFFFFF'; const words = formData.parentsName.trim().toUpperCase().split(' '); let splitIdx = Math.ceil(words.length / 2) || 1; let minDiff = Infinity; if (words.length > 1) { for (let i = 1; i < words.length; i++) { const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length); if (diff < minDiff) { minDiff = diff; splitIdx = i; } } }
    const drawFittedTextVibrant = (text, y, baseSize, maxW) => { let size = baseSize; ctx.font = `900 ${size}px "Satoshi", sans-serif`; while (ctx.measureText(text).width > maxW && size > 16) { size -= 2; ctx.font = `900 ${size}px "Satoshi", sans-serif`; } ctx.fillText(text, 80, y); };
    drawFittedTextVibrant(words.slice(0, splitIdx).join(' '), 360, 50, 450); drawFittedTextVibrant(words.slice(splitIdx).join(' ') + " & FAMILY", 420, 50, 450);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.roundRect(80, 580, 460, 140, 25); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 22px "Satoshi", sans-serif'; ctx.fillText(`📅 Date: ${formData.date}`, 110, 625); ctx.fillText(`⏰ Time: ${formData.time}`, 110, 680); ctx.fillText(`⚖️ Weight: ${formData.weight} Kg`, 300, 625); ctx.fillText(`🎁 Pkg: ${formData.package}`, 300, 680);

    // Removed specific local branding from the image generator itself, keeping it clean
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 20px sans-serif'; ctx.fillText("AVSTUDIOX", 80, 80);

    return canvas.toDataURL('image/jpeg', 1.0);
  };

  const generateGraphics = async () => {
    if (!previewUrl || !formData.parentsName) {
      alert("Please upload a photo and enter the parents' name.");
      return;
    }
    setIsGenerating(true);

    try {
      const isBoy = formData.gender === 'male';

      const babyImg = new Image();
      babyImg.src = previewUrl;
      await new Promise((resolve, reject) => {
        babyImg.onload = resolve;
        babyImg.onerror = () => reject(new Error("Baby image invalid."));
      });

      const [classicUrl, minimalistUrl, vibrantUrl] = await Promise.all([
        generateClassic(babyImg, isBoy),
        generateMinimalist(babyImg, isBoy),
        generateVibrant(babyImg, isBoy)
      ]);

      setGeneratedDesigns([
        { title: "Classic Layout", dataUrl: classicUrl },
        { title: "Modern Minimalist", dataUrl: minimalistUrl },
        { title: "Vibrant Premium", dataUrl: vibrantUrl }
      ]);

    } catch (error) {
      console.error(error);
      alert("Error generating graphics. Please ensure a valid baby photo is uploaded.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <style>
        {`
          .avstudiox-theme {
            font-family: 'Satoshi', system-ui, sans-serif;
            background-color: #000000;
            color: #ffffff;
          }
        `}
      </style>

      <div className="avstudiox-theme min-h-screen flex flex-col selection:bg-white/20">

        {/* HEADER: AVSTUDIOX Cinematic Dark */}
        <header className="bg-black/40 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="glow-border p-2 sm:p-2.5 rounded-xl">
              <Aperture className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Avstudiox Render Engine</h1>
              <p className="hidden sm:block text-[13px] sm:text-[15px] text-[#888] font-medium mt-0.5">Automated Graphic Pipeline</p>
            </div>
          </div>

          {/* AVSTUDIOX IMAGE LOGO (With Sandbox Fallback) */}
          <div className="flex items-center gap-2 sm:gap-3 glow-border px-3 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-default">
            <span className="hidden md:inline text-[10px] text-[#888] font-bold tracking-[0.2em] uppercase mt-0.5">Powered by</span>

            {/* Using the exact uploaded image file */}
            <img
              src="/avstudiox_logo_white.png"
              alt="AVSTUDIOX"
              className="h-[24px] sm:h-[34px] lg:h-[44px] object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />

            {/* Perfect code-replica fallback for web preview where local files can't load */}
            <div className="hidden items-center text-white select-none">
              <span className="text-[12px] sm:text-[14px] font-[800] tracking-[0.08em] leading-none">AVSTUDIOX</span>
              <span className="text-[16px] sm:text-[20px] font-[900] leading-none ml-[1px]">X</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative bg-[#000000]">

          {/* Cinematic Light Glow Background */}
          <div className="absolute top-[5%] left-[10%] w-[80%] h-[80%] bg-white/[0.03] blur-[80px] md:blur-[120px] pointer-events-none rounded-full" />

          {/* FORM SIDEBAR: Deep Dark Minimalist */}
          <aside className="w-full lg:w-[460px] bg-[#000000] border-b lg:border-r lg:border-b-0 border-white/5 lg:overflow-y-auto p-4 sm:p-6 lg:p-8 flex-shrink-0 z-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">New Graphic</h2>
              <Sparkles className="w-5 h-5 text-[#555]" />
            </div>

            <div className="space-y-6">

              {/* 1. UPLOAD AREA */}
              <div>
                <label className="block text-ls font-regular text-[#888] mb-3">1. Primary Subject</label>
                <div
                  className={`glow-border rounded-2xl p-6 text-center cursor-pointer transition-all duration-300`}
                  onClick={() => document.getElementById('photo-upload').click()}
                >
                  {previewUrl ? (
                    <div className="relative group">
                      <img src={previewUrl} alt="Preview" className="mx-auto h-48 w-full object-cover rounded-xl shadow-lg border border-white/10" />
                      <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-sm text-white font-semibold tracking-wide flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Replace Subject</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10">
                      <div className="glow-border w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-ls text-white font-regular">Click To Browse Image</p>
                      <p className="text-xs text-[#666] font-medium">High-Res JPG or PNG</p>
                    </div>
                  )}
                  <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handleBabyImageUpload} />
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 my-4"></div>

              {/* 2. DETAILS AREA */}
              <div className="space-y-5">
                <div>
                  <label className="block  text-ls font-regular text-[#888] mb-2">2. Headline Text</label>
                  <input
                    type="text" name="parentsName" value={formData.parentsName} onChange={handleInputChange}
                    className="w-full glow-border rounded-xl px-5 py-4 text-white placeholder-[#444] transition-all outline-none font-semibold uppercase tracking-wide"
                    placeholder="Enter Parents Name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [color-scheme:dark]">
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Date</label>
                    <GlassDatePicker 
                      value={formData.date} 
                      onChange={(val) => setFormData(prev => ({...prev, date: val}))} 
                    />
                  </div>
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Time</label>
                    <GlassTimePicker 
                      value={formData.time} 
                      onChange={(val) => setFormData(prev => ({...prev, time: val}))} 
                    />
                  </div>
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full glow-border rounded-xl px-5 py-3.5 text-white transition-all outline-none appearance-none font-medium">
                      <option value="male">Boy</option>
                      <option value="female">Girl</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Baby Weight (kg)</label>
                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full glow-border rounded-xl px-5 py-3.5 text-white placeholder-[#444] transition-all outline-none font-medium" placeholder="2.100" />
                  </div>
                </div>

                <div>
                  <label className="block text-ls font-regular  text-[#888] mb-2">Service Package</label>
                  <select name="package" value={formData.package} onChange={handleInputChange} className="w-full glow-border rounded-xl px-5 py-3.5 text-white transition-all outline-none appearance-none font-medium">
                    <option value="Gold">Gold Tier</option>
                    <option value="Silver">Silver Tier</option>
                    <option value="Platinum">Platinum Tier</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              {/* AVSTUDIOX Exact Button: Black with white glow border */}
              <button
                onClick={generateGraphics}
                disabled={isGenerating || !previewUrl || !formData.parentsName}
                className="w-full mt-6 sm:mt-8 glow-border-button rounded-full py-3 sm:py-4 flex justify-center items-center gap-2 font-bold text-base sm:text-lg text-white transition-all duration-300"
              >
                {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin" /> Rendering Assets...</> : <>Generate Designs <ChevronRight className="w-5 h-5" /></>}
              </button>
            </div>
          </aside>

          {/* RESULTS AREA: Pitch Black & Elegant */}
          <section className="flex-1 bg-transparent p-4 sm:p-6 lg:p-10 lg:overflow-y-auto relative z-10">
            {generatedDesigns.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#666]">
                <div className="w-24 h-24 rounded-full glow-border flex items-center justify-center mb-6 shadow-2xl relative">
                  <ImageIcon className="w-8 h-8 text-[#555]" />
                  <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Awaiting Parameters</h3>
                <p className="text-sm text-center max-w-xs text-[#888] font-medium leading-relaxed">Fill the parameters on the left and click generate to process the high-resolution artwork.</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div className="glow-border text-white px-6 py-4 rounded-2xl flex items-center gap-4">
                  <div className="glow-border p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="font-bold text-lg tracking-wide text-white">Render Complete</h3>
                    <p className="text-sm text-[#888] font-medium">3 high-resolution variants generated. Ready for export.</p>
                  </div>
                </div>

                {generatedDesigns.map((design, index) => (
                  <div key={index} className="glow-border rounded-3xl overflow-hidden flex flex-col transition-all duration-300">

                    {/* Card Header */}
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#000]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#888] bg-[#0A0A0A] border border-white/10 px-2.5 py-1 rounded-md">0{index + 1}</span>
                        <h3 className="font-bold text-white text-base sm:text-lg tracking-wide">{design.title}</h3>
                      </div>
                      <a href={design.dataUrl} download={`AVSTUDIOX_${formData.parentsName.split(' ')[0]}_0${index + 1}.jpg`}
                        className="flex items-center justify-center gap-2 glow-border-button px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all active:scale-95 w-full sm:w-auto">
                        <Download className="w-4 h-4 text-white" /> Export JPG
                      </a>
                    </div>

                    {/* Image Display */}
                    <div className="p-4 sm:p-8 lg:p-12 bg-[#0A0A0A] flex-1 flex items-center justify-center relative overflow-hidden group">
                      <img src={design.dataUrl} alt={design.title} className="max-w-full max-h-[50vh] sm:max-h-[60vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-md border border-[#222] relative z-10 transition-transform duration-500 group-hover:scale-[1.02]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}