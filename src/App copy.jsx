import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, Calendar, RefreshCw, CheckCircle2, Sparkles, ChevronRight, Aperture } from 'lucide-react';

export default function App() {
  const LAYOUT = {
    photoX: 26.5,
    photoY: 48.0,
    photoRadius: 19.5,
    textX: 72.0,
    textY: 40.0
  };

  const [formData, setFormData] = useState({
    parentsName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:15',
    gender: 'male',
    weight: '2.100',
    package: 'Gold'
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
        <header className="bg-[#000000] border-b border-white/5 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="bg-[#0A0A0A] p-2 rounded-xl border border-white/10">
              <Aperture className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Avstudiox Render Engine</h1>
              <p className="text-[15px] text-[#888] font-medium">Automated Graphic Pipeline</p>
            </div>
          </div>

          {/* AVSTUDIOX IMAGE LOGO (With Sandbox Fallback) */}
          <div className="flex items-center gap-3 bg-[#0A0A0A] px-5 py-2.5 rounded-full border border-white/10 shadow-sm cursor-default">
            <span className="text-[10px] text-[#888] font-bold tracking-[0.2em] uppercase mt-0.5">Powered by</span>

            {/* Using the exact uploaded image file */}
            <img
              src="/avstudiox_logo_white.png"
              alt="AVSTUDIOX"
              className="h-[44px] object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />

            {/* Perfect code-replica fallback for web preview where local files can't load */}
            <div className="hidden items-center text-white select-none">
              <span className="text-[14px] font-[800] tracking-[0.08em] leading-none">AVSTUDIOX</span>
              <span className="text-[20px] font-[900] leading-none ml-[1px]">X</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-[#000000]">

          {/* Cinematic Light Glow Background */}
          <div className="absolute top-[5%] left-[10%] w-[80%] h-[80%] bg-white/[0.03] blur-[120px] pointer-events-none rounded-full" />

          {/* FORM SIDEBAR: Deep Dark Minimalist */}
          <aside className="w-full lg:w-[460px] bg-[#000000] border-r border-white/5 lg:overflow-y-auto p-8 flex-shrink-0 z-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">New Graphic</h2>
              <Sparkles className="w-5 h-5 text-[#555]" />
            </div>

            <div className="space-y-6">

              {/* 1. UPLOAD AREA */}
              <div>
                <label className="block text-ls font-regular text-[#888] mb-3">1. Primary Subject</label>
                <div
                  className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${previewUrl ? 'border-white/20 bg-[#0A0A0A]' : 'border-white/10 bg-[#050505] hover:border-white/30 hover:bg-[#0A0A0A]'}`}
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
                      <div className="bg-[#0A0A0A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
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
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-[#444] focus:border-white/40 focus:bg-[#0A0A0A] transition-all outline-none font-semibold uppercase tracking-wide"
                    placeholder="Enter Parents Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 [color-scheme:dark]">
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-white/40 focus:bg-[#0A0A0A] transition-all outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Time</label>
                    <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-white/40 focus:bg-[#0A0A0A] transition-all outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Theme Color</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-white/40 focus:bg-[#0A0A0A] transition-all outline-none appearance-none font-medium">
                      <option value="male">Ocean Blue</option>
                      <option value="female">Rose Pink</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#888] text-ls font-regular mb-2">Subject Weight</label>
                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-[#444] focus:border-white/40 focus:bg-[#0A0A0A] transition-all outline-none font-medium" placeholder="2.100" />
                  </div>
                </div>

                <div>
                  <label className="block text-ls font-regular  text-[#888] mb-2">Service Package</label>
                  <select name="package" value={formData.package} onChange={handleInputChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-white/40 focus:bg-[#0A0A0A] transition-all outline-none appearance-none font-medium">
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
                className="relative w-full group mt-8"
              >
                {/* Framer-style layered glow background */}
                <div className={`absolute -inset-0.5 rounded-full blur-md transition duration-500 
                  ${(!previewUrl || !formData.parentsName) ? 'bg-transparent' : 'bg-white/20 group-hover:bg-white/40'}`}>
                </div>

                {/* Button Content */}
                <div className={`relative w-full border rounded-full py-4 flex justify-center items-center gap-2 font-bold text-base transition-colors duration-300
                  ${(!previewUrl || !formData.parentsName)
                    ? 'bg-[#0A0A0A] border-white/5 text-[#555] cursor-not-allowed'
                    : 'bg-[#000000] border-white/20 text-white group-hover:border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-active:scale-[0.99]'}`}
                >
                  {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin" /> Rendering Assets...</> : <>Generate Designs <ChevronRight className="w-5 h-5" /></>}
                </div>
              </button>
            </div>
          </aside>

          {/* RESULTS AREA: Pitch Black & Elegant */}
          <section className="flex-1 bg-transparent p-6 lg:p-10 lg:overflow-y-auto relative z-10">
            {generatedDesigns.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#666]">
                <div className="w-24 h-24 rounded-full border border-white/10 bg-[#0A0A0A] flex items-center justify-center mb-6 shadow-2xl relative">
                  <ImageIcon className="w-8 h-8 text-[#555]" />
                  <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Awaiting Parameters</h3>
                <p className="text-sm text-center max-w-xs text-[#888] font-medium leading-relaxed">Fill the parameters on the left and click generate to process the high-resolution artwork.</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div className="bg-[#0A0A0A] border border-white/10 text-white px-6 py-4 rounded-2xl flex items-center gap-4">
                  <div className="bg-[#111] p-2 rounded-full border border-white/5"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="font-bold text-lg tracking-wide text-white">Render Complete</h3>
                    <p className="text-sm text-[#888] font-medium">3 high-resolution variants generated. Ready for export.</p>
                  </div>
                </div>

                {generatedDesigns.map((design, index) => (
                  <div key={index} className="bg-[#050505] rounded-3xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                    {/* Card Header */}
                    <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#000]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#888] bg-[#0A0A0A] border border-white/10 px-2.5 py-1 rounded-md">0{index + 1}</span>
                        <h3 className="font-bold text-white text-lg tracking-wide">{design.title}</h3>
                      </div>
                      <a href={design.dataUrl} download={`AVSTUDIOX_${formData.parentsName.split(' ')[0]}_0${index + 1}.jpg`}
                        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95">
                        <Download className="w-4 h-4" /> Export JPG
                      </a>
                    </div>

                    {/* Image Display */}
                    <div className="p-8 lg:p-12 bg-[#0A0A0A] flex-1 flex items-center justify-center relative overflow-hidden group">
                      <img src={design.dataUrl} alt={design.title} className="max-w-full max-h-[60vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-md border border-[#222] relative z-10 transition-transform duration-500 group-hover:scale-[1.02]" />
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