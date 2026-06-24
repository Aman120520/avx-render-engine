import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, RefreshCw, Aperture } from 'lucide-react';

import { getThemesForGender } from './constants/themes';
import { renderTheme, loadImage, ensureFonts } from './utils/canvasHelper';
import { ParticleSystem, BackgroundShapes, VideoBackground } from './components/Background';
import { GlassSelect } from './components/Pickers';

const todayDefaults = () => ({
  parentsName: '',
  gender: 'male'
});

export default function App() {
  const [formData, setFormData] = useState(todayDefaults);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatedDesigns, setGeneratedDesigns] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    link.onload = () => ensureFonts();
    return () => document.head.removeChild(link);
  }, []);

  const handleReset = () => {
    setFormData(todayDefaults());
    setPreviewUrl(null);
    setGeneratedDesigns([]);
  };

  const handleRender = async () => {
    if (!previewUrl || !formData.parentsName.trim()) {
      alert("Please upload a baby photo and enter the parents' name.");
      return;
    }
    setIsGenerating(true);
    try {
      const babyImg = await loadImage(previewUrl);
      const logoImg = await loadImage('/logo.png').catch(() => null);
      const themes = getThemesForGender(formData.gender);
      const designs = await Promise.all(
        themes.map(async (theme) => ({
          id: theme.id,
          title: theme.label,
          dataUrl: await renderTheme(theme, { babyImg, logoImg, formData })
        }))
      );
      setGeneratedDesigns(designs);
    } catch (e) {
      console.error(e);
      alert('Something went wrong while rendering. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fileName = (id) =>
    `${(formData.parentsName || 'baby').trim().replace(/\s+/g, '-').toLowerCase()}-${id}.png`;

  return (
    <div className="avstudiox-theme min-h-screen text-white font-['Satoshi',_sans-serif] selection:bg-white/20 relative overflow-y-auto bg-transparent">
      <div className="fixed inset-0 bg-black z-[-50]" />
      <VideoBackground />
      <div className="grid-background pointer-events-none z-[-30]" />
      <div className="noise-overlay pointer-events-none z-[-20]" />
      <BackgroundShapes />
      <ParticleSystem />
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-[100]" />

      <header className="border-white/5 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={handleReset}>
          <div className="glow-border p-2 sm:p-2.5 rounded-xl text-white">
            <Aperture className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">AvstudioX Render Engine</h1>
            <p className="hidden md:block text-[13px] sm:text-[15px] text-[#888] font-medium mt-0.5">Baby Arrival Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 glow-border px-3 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-default scale-75 sm:scale-90 lg:scale-100">
          <span className="hidden sm:inline text-[9px] text-[#888] font-bold tracking-[0.2em] uppercase mt-0.5">powered by</span>
          <img
            src="/avstudiox_logo_white.png"
            alt="AVSTUDIOX"
            className="h-[24px] sm:h-[32px] lg:h-[40px] object-contain opacity-90"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>
      </header>

      <main className="relative min-h-[calc(100vh-80px)] animate-fade-up">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold">Baby Arrival Card</h2>
            <p className="text-[#64748B] font-medium mt-1 text-[10px] sm:text-xs">
              upload a photo, fill the details, get ready-to-share cards
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="w-full lg:w-[460px] space-y-6 flex-shrink-0">
              <div>
                <label className="block text-[#888] text-sm font-medium mb-3">1. Baby Photo</label>
                <div
                  className="glow-border rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02]"
                  onClick={() => document.getElementById('b_up').click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="h-48 w-full object-cover rounded-xl border border-white/10" alt="Preview" />
                  ) : (
                    <div className="py-10">
                      <Upload className="w-8 h-8 mx-auto mb-4 text-white" />
                      <p className="font-bold">Browse Baby Image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="b_up"
                    hidden
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) setPreviewUrl(URL.createObjectURL(f));
                    }}
                  />
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-5">
                <div>
                  <label className="block text-[#888] text-sm font-medium mb-2">2. Parents Name</label>
                  <input
                    type="text"
                    placeholder="enter parents name"
                    className="w-full glow-border bg-transparent rounded-xl px-5 py-4 font-bold outline-none focus:bg-white/5"
                    value={formData.parentsName}
                    onChange={(e) => setFormData({ ...formData, parentsName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[#888] text-sm font-medium mb-2">3. Gender</label>
                  <GlassSelect
                    value={formData.gender}
                    onChange={(v) => setFormData({ ...formData, gender: v })}
                    options={[{ value: 'male', label: 'Boy' }, { value: 'female', label: 'Girl' }]}
                  />
                </div>
                <button
                  onClick={handleRender}
                  disabled={isGenerating}
                  className="w-full py-4 bg-white text-black font-bold text-lg rounded-full shadow-lg active:scale-95 transition-all mt-2 disabled:opacity-60"
                >
                  {isGenerating ? 'Rendering...' : 'Generate Cards'}
                </button>
              </div>
            </aside>

            <section className="flex-1 p-6 lg:p-10 rounded-[32px] lg:overflow-y-auto bg-black relative glow-border">
              {generatedDesigns.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-12 pb-20 relative z-10">
                  {generatedDesigns.map((d) => (
                    <div key={d.id} className="glow-border rounded-[32px] overflow-hidden bg-black animate-fade-up">
                      <div className="px-6 py-5 flex justify-between items-center border-b border-white/5">
                        <h3 className="font-bold text-lg">{d.title}</h3>
                        <a
                          href={d.dataUrl}
                          download={fileName(d.id)}
                          className="px-6 py-2 border border-white rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </div>
                      <div className="p-8 lg:p-12 flex justify-center bg-[#050505]">
                        <img src={d.dataUrl} className="max-w-full max-h-[60vh] object-contain shadow-2xl rounded-lg" alt={d.title} />
                      </div>
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
                  <h3 className="text-2xl font-bold mb-2">Awaiting Details</h3>
                  <p className="text-[#64748B] text-sm max-w-[280px] leading-relaxed font-medium">
                    Upload a photo and fill in the details to generate high-resolution celebration cards.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500 p-6 text-center">
          <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin mb-6 sm:mb-8" />
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Rendering Cards...</h2>
          <p className="text-[#64748B] font-bold text-[10px] sm:text-xs px-6 uppercase tracking-widest">
            Crafting high-resolution celebration graphics
          </p>
        </div>
      )}
    </div>
  );
}
