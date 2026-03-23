import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, RefreshCw, Sparkles, ChevronRight, Aperture, ArrowLeft, Search } from 'lucide-react';

// --- Imports ---
import { FESTIVALS } from './constants/festivals';
import { generateBabyPremium, generateFestivalCreative } from './utils/canvasHelper';
import { ParticleSystem, BackgroundShapes, VideoBackground } from './components/Background';
import { GlassDatePicker, GlassTimePicker } from './components/Pickers';

export default function App() {
  // --- State Architecture ---
  const [view, setView] = useState('landing');
  const [formData, setFormData] = useState(() => {
    const d = new Date();
    return {
      parentsName: '',
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      time: '09:00',
      gender: 'male',
      weight: '2.100'
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
      const premium = await generateBabyPremium(babyImg, formData.gender === 'male', logoImg, formData);
      setGeneratedDesigns([{ title: "Premium High-Res Variant", dataUrl: premium }]);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const filteredFestivals = FESTIVALS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.gujarati.includes(searchQuery)
  );

  return (
    <div className="avstudiox-theme min-h-screen text-white font-['Satoshi',_sans-serif] selection:bg-white/20 relative overflow-hidden bg-transparent">

      {/* Dynamic Background Stack */}
      <div className="fixed inset-0 bg-black z-[-50]" />
      <VideoBackground />
      <div className="grid-background pointer-events-none z-[-30]" />
      <div className="noise-overlay pointer-events-none z-[-20]" />
      <BackgroundShapes />
      <ParticleSystem />

      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-[100]" />

      {/* Persistence Header */}
      <header className="bg-black/40 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => resetAndNavigate('landing')}>
          <div className="glow-border p-2 sm:p-2.5 rounded-xl text-white">
            <Aperture className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Avstudiox Render Engine</h1>
            <p className="hidden sm:block text-[13px] sm:text-[15px] text-[#888] font-medium mt-0.5">Automated Graphic Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 glow-border px-3 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-default scale-90 sm:scale-100">
          <span className="text-[9px] text-[#888] font-bold tracking-[0.25em] uppercase mt-0.5">POWERED BY</span>
          <img
            src="/avstudiox_logo_white.png"
            alt="AVSTUDIOX"
            className="h-[32px] sm:h-[32px] object-contain opacity-90"
            onError={e => e.target.style.display = 'none'}
          />
        </div>
      </header>

      <main className="relative">
        {/* --- Landing View --- */}
        {view === 'landing' && (
          <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center animate-fade-up relative overflow-hidden">
            <div className="backdrop-glow scale-[2.5] opacity-20" />
            <div className="mb-6 flex items-center gap-2 px-4 py-2 glow-border rounded-full text-[13px] font-medium tracking-wide cursor-default">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Crafting Unique Brand Identities
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.1] animate-fade-up">
              Cinematic Branding <br /> That Truly Speaks.
            </h1>
            <p className="text-[#A1A1A1] text-lg max-w-2xl mb-12 font-medium animate-fade-up opacity-80">
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
          <div className="max-w-6xl mx-auto px-8 py-20 animate-fade-up">
            <div className="flex items-center gap-4 mb-12">
              <button onClick={() => resetAndNavigate('landing')} className="p-2 glow-border rounded-xl bg-white/5 text-white active:scale-90 transition-all"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-4xl font-bold tracking-tight">Select Creative Pipeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div onClick={() => { setView('baby'); setGeneratedDesigns([]); setPreviewUrl(null); }} className="glow-border min-h-[400px] rounded-[32px] p-10 relative cursor-pointer group flex flex-col justify-end overflow-hidden bg-white/[0.02]">
                <div className="absolute top-10 right-10 p-4 rounded-full border border-white/10 bg-white/5 group-hover:scale-110 transition-all"><ImageIcon className="w-8 h-8" /></div>
                <h3 className="text-3xl font-bold mb-4">Baby Arrival <br />Announcements</h3>
                <p className="text-[#888] font-medium max-w-xs group-hover:text-white/80">Premium birth celebration cards with custom Subject integration.</p>
              </div>
              <div onClick={() => { setView('festival'); setGeneratedDesigns([]); }} className="glow-border min-h-[400px] rounded-[32px] p-10 relative cursor-pointer group flex flex-col justify-end overflow-hidden bg-white/[0.02]">
                <div className="absolute top-10 right-10 p-4 rounded-full border border-white/10 bg-white/5 group-hover:scale-110 transition-all"><Sparkles className="w-8 h-8" /></div>
                <h3 className="text-3xl font-bold mb-4">Festival <br />Greeting Posts</h3>
                <p className="text-[#888] font-medium max-w-xs group-hover:text-white/80">Automated cultural festival posts for Instagram and social media.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- Baby Pipeline --- */}
        {view === 'baby' && (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-black animate-fade-up">
            <aside className="w-full lg:w-[460px] border-b lg:border-r border-white/5 p-6 sm:p-8 space-y-8 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => resetAndNavigate('selection')} className="flex items-center gap-2 text-[#888] hover:text-white transition-colors group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back</button>
                <Sparkles className="w-5 h-5 text-[#555]" />
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[#888] text-sm font-medium mb-3">1. Primary Subject</label>
                  <div className="glow-border rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02]" onClick={() => document.getElementById('b_up').click()}>
                    {previewUrl ? <img src={previewUrl} className="h-48 w-full object-cover rounded-xl border border-white/10" alt="Preview" /> : <div className="py-10"><Upload className="w-8 h-8 mx-auto mb-4 text-white" /><p className="font-bold">Browse Baby Image</p></div>}
                    <input type="file" id="b_up" hidden onChange={e => { const f = e.target.files[0]; if (f) setPreviewUrl(URL.createObjectURL(f)); }} />
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-5">
                  <div>
                    <label className="block text-[#888] text-sm font-medium mb-2">2. Headline Text</label>
                    <input type="text" placeholder="ENTER PARENTS NAME" className="w-full glow-border bg-transparent rounded-xl px-5 py-4 font-bold uppercase outline-none focus:bg-white/5" value={formData.parentsName} onChange={e => setFormData({ ...formData, parentsName: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[11px] font-bold text-[#888] ml-1">DATE</label><GlassDatePicker value={formData.date} onChange={v => setFormData({ ...formData, date: v })} /></div>
                    <div className="space-y-2"><label className="text-[11px] font-bold text-[#888] ml-1">TIME</label><GlassTimePicker value={formData.time} onChange={v => setFormData({ ...formData, time: v })} /></div>
                    <div className="space-y-2"><label className="text-[11px] font-bold text-[#888] ml-1">GENDER</label><select className="w-full glow-border bg-black rounded-xl px-5 py-3.5 font-bold outline-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}><option value="male">Boy</option><option value="female">Girl</option></select></div>
                    <div className="space-y-2"><label className="text-[11px] font-bold text-[#888] ml-1">WEIGHT</label><input type="text" className="w-full glow-border bg-transparent rounded-xl px-5 py-3.5 font-bold outline-none" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} /></div>
                  </div>
                  <button onClick={handleBabyRender} disabled={isGenerating} className="w-full py-4 bg-white text-black font-bold text-lg rounded-full shadow-lg active:scale-95 transition-all mt-4">{isGenerating ? 'Rendering Assets...' : 'Generate Designs'}</button>
                </div>
              </div>
            </aside>
            <section className="flex-1 p-6 lg:p-10 lg:overflow-y-auto bg-black relative">
              {generatedDesigns.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-12 pb-20 relative z-10">
                  {generatedDesigns.map((d, i) => (
                    <div key={i} className="glow-border rounded-[32px] overflow-hidden bg-black animate-fade-up">
                      <div className="px-6 py-5 flex justify-between items-center border-b border-white/5">
                        <h3 className="font-bold text-lg tracking-tight">{d.title}</h3>
                        <div className="flex gap-2">
                          <a href={d.dataUrl} download className="px-6 py-2 border border-white rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all">Export JPG</a>
                        </div>
                      </div>
                      <div className="p-8 lg:p-12 flex justify-center bg-[#050505]"><img src={d.dataUrl} className="max-w-full max-h-[60vh] object-contain shadow-2xl rounded-lg" alt="Generated Design" /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#333]"><ImageIcon className="w-16 h-16 mb-4" /><p className="text-xl font-bold tracking-tight">Awaiting Parameters</p></div>
              )}
            </section>
          </div>
        )}

        {/* --- Festival Pipeline --- */}
        {view === 'festival' && (
          <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-fade-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => generatedDesigns.length > 0 ? setGeneratedDesigns([]) : resetAndNavigate('selection')}
                  className="p-3 glow-border rounded-2xl bg-white/5 active:scale-90 transition-all text-white"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div><h2 className="text-4xl font-bold tracking-tight">Festival Pipeline</h2><p className="text-[#64748B] font-medium tracking-widest mt-1 text-xs uppercase">Automated Regional Content Search</p></div>
              </div>
              <div className="w-full lg:w-[400px] relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333]" />
                <input type="text" placeholder="Search Festival..." className="w-full glow-border bg-white/[0.03] rounded-full py-4 pl-16 pr-8 font-bold outline-none focus:bg-white/10 transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>

            {generatedDesigns.length > 0 ? (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-bold flex items-center gap-4">{selectedFestival?.name} <span className="text-[#333] tracking-tighter">— OPTIONS</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-32">
                  {generatedDesigns.map((d, i) => (
                    <div key={i} className="glow-border rounded-[40px] overflow-hidden bg-white/[0.01] group">
                      <div className="p-6 bg-[#070707] flex items-center justify-center"><img src={d.dataUrl} className="w-full aspect-[3/4] object-contain rounded-[32px] shadow-2xl group-hover:scale-[1.03] transition-all duration-1000" alt="Festival design" /></div>
                      <div className="p-6 flex justify-between items-center bg-black/80">
                        <span className="font-bold text-xs opacity-40 uppercase tracking-widest">{d.title}</span>
                        <a href={d.dataUrl} download className="p-3 border border-white rounded-full hover:bg-white hover:text-black transition-all"><Download className="w-4 h-4" /></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
                {filteredFestivals.map(f => (
                  <div key={f.id} onClick={() => handleStartFestival(f)} className="glow-border min-h-64 rounded-[32px] p-8 bg-white/[0.01] hover:bg-white/[0.05] cursor-pointer flex flex-col justify-end group transition-all relative overflow-hidden" style={{ borderBottom: `4px solid ${f.color}22` }}>
                    <div className="absolute top-6 right-6 p-3 rounded-xl bg-white/5 text-white/30 group-hover:text-white transition-all"><Sparkles className="w-6 h-6" /></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-1">{f.name}</h4>
                      <p className="font-bold text-[10px] tracking-widest uppercase opacity-40" style={{ color: f.color }}>{f.gujarati}</p>
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
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
          <RefreshCw className="w-16 h-16 text-white animate-spin mb-8" />
          <h2 className="text-4xl font-bold tracking-tighter mb-4 uppercase text-center">Searching World Wide...</h2>
          <p className="text-[#64748B] font-bold tracking-[0.2em] uppercase text-xs text-center px-6">Optimizing {selectedFestival?.name || 'Asset'} Creatives for Payal Maternity</p>
        </div>
      )}
    </div>
  );
}