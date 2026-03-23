import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, RefreshCw, Sparkles, ChevronRight, Aperture, ArrowLeft, Search } from 'lucide-react';

// --- Imports ---
import { FESTIVALS } from './constants/festivals';
import { generateTemplateBased, generateMinimalist, generateVibrant, generateFestivalCreative } from './utils/canvasHelper';
import { ParticleSystem, BackgroundShapes, VideoBackground } from './components/Background';
import { GlassDatePicker, GlassTimePicker, GlassSelect } from './components/Pickers';

export default function App() {
  // --- State Architecture ---
  const [view, setView] = useState('landing');
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFestival, setSelectedFestival] = useState(null);

  // --- External Font Setup ---
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // --- Core Handlers ---
  const resetAndNavigate = (newView) => {
    setView(newView);
    setGeneratedDesigns([]);
    setSelectedFestival(null);
    setSearchQuery('');
    setPreviewUrl(null);
    const d = new Date();
    setFormData({
      parentsName: '',
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
      gender: 'male',
      weight: '2.100',
      package: 'Gold'
    });
  };

  const handleStartFestival = async (fest) => {
    setIsGenerating(true); setSelectedFestival(fest);
    try {
      const logoImg = new Image(); logoImg.crossOrigin = "anonymous"; logoImg.src = '/logo.png';
      await new Promise(r => logoImg.onload = r);
      await new Promise(r => setTimeout(r, 1500)); // Simulating AI search
      const designs = await Promise.all([0, 1, 2].map(async (i) => ({
        title: `Option 0${i + 1}`,
        dataUrl: await generateFestivalCreative(fest, i, logoImg)
      })));
      setGeneratedDesigns(designs);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleBabyRender = async () => {
    if (!previewUrl || !formData.parentsName) return alert("Please upload a photo and enter the parents' name.");
    setIsGenerating(true);
    try {
      const babyImg = new Image(); babyImg.src = previewUrl; await new Promise(r => babyImg.onload = r);
      const logoImg = new Image(); logoImg.crossOrigin = "anonymous"; logoImg.src = '/logo.png'; await new Promise(r => logoImg.onload = r);
      const designs = await Promise.all([
        { title: "Classic Premium High-Res", dataUrl: await generateTemplateBased(babyImg, formData.gender === 'male', logoImg, formData) },
        { title: "Minimalist Modern Card", dataUrl: await generateMinimalist(babyImg, formData.gender === 'male', logoImg, formData) },
        { title: "Vibrant Announcement", dataUrl: await generateVibrant(babyImg, formData.gender === 'male', logoImg, formData) }
      ]);
      setGeneratedDesigns(designs);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const filteredFestivals = FESTIVALS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.gujarati.includes(searchQuery)
  );

  return (
    <div className="avstudiox-theme min-h-screen text-white font-['Satoshi',_sans-serif] selection:bg-white/20 relative overflow-y-auto bg-transparent">

      {/* Dynamic Background Stack */}
      <div className="fixed inset-0 bg-black z-[-50]" />
      <VideoBackground />
      <div className="grid-background pointer-events-none z-[-30]" />
      <div className="noise-overlay pointer-events-none z-[-20]" />
      <BackgroundShapes />
      <ParticleSystem />

      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-[100]" />

      {/* Persistence Header */}
      {/* <header className="bg-black/10 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-50"> */}
      <header className="border-white/5 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => resetAndNavigate('landing')}>
          <div className="glow-border p-2 sm:p-2.5 rounded-xl text-white">
            <Aperture className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">AvstudioX Render Engine</h1>
            <p className="hidden md:block text-[13px] sm:text-[15px] text-[#888] font-medium mt-0.5">Automated Graphic Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 glow-border px-3 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-default scale-75 sm:scale-90 lg:scale-100">
          <span className="hidden sm:inline text-[9px] text-[#888] font-bold tracking-[0.2em] uppercase mt-0.5">powered by</span>
          <img
            src="/avstudiox_logo_white.png"
            alt="AVSTUDIOX"
            className="h-[24px] sm:h-[32px] lg:h-[40px] object-contain opacity-90"
            onError={e => e.target.style.display = 'none'}
          />
        </div>
      </header>

      <main className="relative">
        {/* --- Landing View --- */}
        {view === 'landing' && (
          <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center animate-fade-up relative overflow-hidden">
            <div className="backdrop-glow scale-[2.5] opacity-20" />
            <div className="mb-6 flex items-center gap-2 px-4 py-2 glow-border rounded-full text-[13px] font-medium  cursor-default">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Crafting Unique Brand Identities
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 max-w-4xl leading-[1.1] animate-fade-up">
              Cinematic branding <br /> that truly speaks.
            </h1>
            <p className="text-[#A1A1A1] text-base sm:text-lg max-w-2xl mb-12 font-medium animate-fade-up opacity-80 px-4 sm:px-0">
              We craft custom brand identities and visual campaigns that don't just look good — they speak. Bold, cinematic, and built to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
              <button
                onClick={() => resetAndNavigate('selection')}
                className="glow-border px-12 py-4 rounded-full font-bold text-lg flex items-center gap-2 group active:scale-95 transition-all"
              >
                Get Started
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* --- Selection View --- */}
        {view === 'selection' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-20 animate-fade-up">
            <div className="flex items-center gap-4 mb-10 sm:mb-12">
              <button onClick={() => resetAndNavigate('landing')} className="p-2 glow-border rounded-xl bg-white/5 text-white active:scale-90 transition-all"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-2xl sm:text-4xl font-bold ">Select creative pipeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div onClick={() => { setView('baby'); setGeneratedDesigns([]); setPreviewUrl(null); }} className="glow-border min-h-[320px] sm:min-h-[400px] rounded-[32px] p-8 sm:p-10 relative cursor-pointer group flex flex-col justify-end overflow-hidden bg-white/[0.02]">
                <div className="absolute top-8 sm:top-10 right-8 sm:right-10 p-3 sm:p-4 rounded-full border border-white/10 bg-white/5 group-hover:scale-110 transition-all"><ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" /></div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Baby arrival <br />announcements</h3>
                <p className="text-[#888] text-sm sm:text-base font-medium max-w-xs group-hover:text-white/80">Premium birth celebration cards with custom subject integration.</p>
              </div>
              <div onClick={() => { setView('festival'); setGeneratedDesigns([]); }} className="glow-border min-h-[320px] sm:min-h-[400px] rounded-[32px] p-8 sm:p-10 relative cursor-pointer group flex flex-col justify-end overflow-hidden bg-white/[0.02]">
                <div className="absolute top-8 sm:top-10 right-8 sm:right-10 p-3 sm:p-4 rounded-full border border-white/10 bg-white/5 group-hover:scale-110 transition-all"><Sparkles className="w-6 h-6 sm:w-8 sm:h-8" /></div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Festival <br />greeting posts</h3>
                <p className="text-[#888] text-sm sm:text-base font-medium max-w-xs group-hover:text-white/80">Automated cultural festival posts for instagram and social media.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- Baby Pipeline --- */}
        {view === 'baby' && (
          <div className="min-h-[calc(100vh-80px)] animate-fade-up">
            <div className="p-6 lg:p-10 max-w-7xl mx-auto">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                <button
                  onClick={() => resetAndNavigate('selection')}
                  className="p-2 sm:p-3 glow-border rounded-2xl bg-white/5 active:scale-90 transition-all text-white"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold ">Baby Arrival</h2>
                  <p className="text-[#64748B] font-medium mt-1 text-[10px] sm:text-xs">premium birth celebration graphics</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">
                <aside className="w-full lg:w-[460px] space-y-8 flex-shrink-0">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[#888] text-sm font-medium mb-3">1. Primary Subject</label>
                      <div className="glow-border rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02]" onClick={() => document.getElementById('b_up').click()}>
                        {previewUrl ? <img src={previewUrl} className="h-48 w-full object-cover rounded-xl border border-white/10" alt="Preview" /> : <div className="py-10"><Upload className="w-8 h-8 mx-auto mb-4 text-white" /><p className="font-bold">Browse Baby Image</p></div>}
                        <input type="file" id="b_up" hidden accept="image/png, image/jpeg" onChange={e => { const f = e.target.files[0]; if (f) setPreviewUrl(URL.createObjectURL(f)); }} />
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[#888] text-sm font-medium mb-2">2. Headline Text</label>
                        <input type="text" placeholder="enter parents name" className="w-full glow-border bg-transparent rounded-xl px-5 py-4 font-bold  outline-none focus:bg-white/5" value={formData.parentsName} onChange={e => setFormData({ ...formData, parentsName: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-sm mb-2 font-medium text-[#888] ml-1">Date</label><GlassDatePicker value={formData.date} onChange={v => setFormData({ ...formData, date: v })} /></div>
                        <div className="space-y-2"><label className="text-sm mb-2 font-medium text-[#888] ml-1">Time</label><GlassTimePicker value={formData.time} onChange={v => setFormData({ ...formData, time: v })} /></div>
                        <div className="space-y-2"><label className="text-sm mb-2 font-medium text-[#888] ml-1">Gender</label><GlassSelect value={formData.gender} onChange={v => setFormData({ ...formData, gender: v })} options={[{ value: 'male', label: 'Boy' }, { value: 'female', label: 'Girl' }]} /></div>
                        <div className="space-y-2"><label className="text-sm mb-2 font-medium text-[#888] ml-1">Weight</label><input type="text" className="w-full glow-border bg-transparent rounded-xl px-5 py-3.5 font-bold outline-none" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} /></div>
                        <div className="space-y-2 col-span-2"><label className="text-sm mb-2 font-medium text-[#888] ml-1 ">Service Package</label><GlassSelect value={formData.package} onChange={v => setFormData({ ...formData, package: v })} options={[{ value: 'Gold', label: 'Gold Tier' }, { value: 'Silver', label: 'Silver Tier' }, { value: 'Platinum', label: 'Platinum Tier' }, { value: 'Standard', label: 'Standard' }]} /></div>
                      </div>
                      <button onClick={handleBabyRender} disabled={isGenerating} className="w-full py-4 bg-white text-black font-bold text-lg rounded-full shadow-lg active:scale-95 transition-all mt-4">{isGenerating ? 'Rendering Assets...' : 'Generate Designs'}</button>
                    </div>
                  </div>
                </aside>
                <section className="flex-1 p-6 lg:p-10 rounded-[32px] lg:overflow-y-auto bg-black relative glow-border">
                  {generatedDesigns.length > 0 ? (
                    <div className="max-w-4xl mx-auto space-y-12 pb-20 relative z-10">
                      {generatedDesigns.map((d, i) => (
                        <div key={i} className="glow-border rounded-[32px] overflow-hidden bg-black animate-fade-up">
                          <div className="px-6 py-5 flex justify-between items-center border-b border-white/5">
                            <h3 className="font-bold text-lg ">{d.title}</h3>
                            <div className="flex gap-2">
                              <a href={d.dataUrl} download className="px-6 py-2 border border-white rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all">Export JPG</a>
                            </div>
                          </div>
                          <div className="p-8 lg:p-12 flex justify-center bg-[#050505]"><img src={d.dataUrl} className="max-w-full max-h-[60vh] object-contain shadow-2xl rounded-lg" alt="Generated Design" /></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-20 lg:py-0">
                      <div className="relative mb-8 group">
                        <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20 scale-150" style={{ animationDuration: '4s' }} />
                        <div className="w-24 h-24 rounded-full glow-border flex items-center justify-center relative z-10 bg-black shadow-2xl">
                          <ImageIcon className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold  mb-2">Awaiting Parameters</h3>
                      <p className="text-[#64748B] text-sm max-w-[280px] leading-relaxed font-medium">
                        Fill in the details on the left and upload a photo to generate your high-resolution creatives.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}

        {/* --- Festival Pipeline --- */}
        {view === 'festival' && (
          <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-fade-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 sm:mb-16">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={() => generatedDesigns.length > 0 ? setGeneratedDesigns([]) : resetAndNavigate('selection')}
                  className="p-2 sm:p-3 glow-border rounded-2xl bg-white/5 active:scale-90 transition-all text-white"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-bold ">Festival Pipeline</h2>
                  <p className="text-[#64748B] font-medium mt-1 text-[10px] sm:text-xs">automated regional content search</p>
                </div>
              </div>
              <div className="w-full lg:w-[400px] relative mt-2 lg:mt-0">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#333]" />
                <input type="text" placeholder="Search Festival..." className="w-full glow-border bg-white/[0.03] rounded-full py-3 sm:py-4 pl-14 sm:pl-16 pr-8 font-bold text-sm sm:text-base outline-none focus:bg-white/10 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>

            {generatedDesigns.length > 0 ? (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <h3 className="text-xl sm:text-3xl font-bold flex items-center gap-3 sm:gap-4">{selectedFestival?.name} <span className="text-[#333]">— options</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 pb-32">
                  {generatedDesigns.map((d, i) => (
                    <div key={i} className="glow-border rounded-[40px] overflow-hidden bg-white/[0.01] group">
                      <div className="p-6 bg-[#070707] flex items-center justify-center"><img src={d.dataUrl} className="w-full aspect-[3/4] object-contain rounded-[32px] shadow-2xl group-hover:scale-[1.03] transition-all duration-1000" alt="Festival design" /></div>
                      <div className="p-6 flex justify-between items-center bg-black/80">
                        <span className="font-bold text-xs opacity-40  ">{d.title}</span>
                        <a href={d.dataUrl} download className="p-3 border border-white rounded-full hover:bg-white hover:text-black transition-all"><Download className="w-4 h-4" /></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pb-20">
                {filteredFestivals.map(f => (
                  <div
                    key={f.id}
                    onClick={() => handleStartFestival(f)}
                    className="glow-border min-h-[160px] sm:min-h-64 rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 cursor-pointer flex flex-col justify-end group transition-all relative overflow-hidden active:scale-[0.98]"
                  >
                    {/* Abstract Theme Glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10 -mr-20 -mt-20 group-hover:opacity-30 transition-opacity" style={{ background: f.color }} />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-[60px] opacity-5 group-hover:opacity-15 transition-opacity" style={{ background: f.color }} />

                    {/* Metadata Pill */}
                    <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black  text-[#666] group-hover:text-white/80 transition-colors ">{f.date}</span>
                    </div>

                    <div className="absolute top-6 sm:top-8 right-6 sm:right-8 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] text-white/20 group-hover:bg-white/10 group-hover:text-white transition-all scale-75 lg:scale-100">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="relative z-10">
                      <p className="font-bold text-[8px] sm:text-[10px] mb-1.5 sm:mb-2 opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: f.color }}>{f.hook}</p>
                      <h4 className="text-xl sm:text-2xl font-black mb-1 transition-transform group-hover:translate-x-1">{f.name}</h4>
                      <div className="h-px w-6 sm:w-8 bg-white/10 group-hover:w-16 transition-all duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- AI Generation Modal --- */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500 p-6 text-center">
          <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin mb-6 sm:mb-8" />
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">searching world wide...</h2>
          <p className="text-[#64748B] font-bold text-[10px] sm:text-xs px-6">optimizing {selectedFestival?.name || 'asset'} creatives for payal maternity</p>
        </div>
      )}
    </div>
  );
}