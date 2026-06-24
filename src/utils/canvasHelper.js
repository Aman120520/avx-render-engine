import { paletteFor } from '../constants/themes';

const FONT_FAMILY = 'Satoshi';
const FONT_WEIGHTS = [300, 400, 500, 700, 900];

// --- Font + asset loading (cached, runs once) ---
let fontsPromise = null;
export const ensureFonts = () => {
  if (fontsPromise) return fontsPromise;
  if (typeof document === 'undefined' || !document.fonts) {
    fontsPromise = Promise.resolve();
    return fontsPromise;
  }
  fontsPromise = Promise.all(
    FONT_WEIGHTS.map((w) => document.fonts.load(`${w} 64px ${FONT_FAMILY}`).catch(() => null))
  ).then(() => document.fonts.ready);
  return fontsPromise;
};

const imageCache = new Map();
export const loadImage = (src) => {
  if (!src) return Promise.reject(new Error('missing image src'));
  const cacheable = !src.startsWith('blob:') && !src.startsWith('data:');
  if (cacheable && imageCache.has(src)) return imageCache.get(src);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
  if (cacheable) imageCache.set(src, promise);
  return promise;
};

// --- Text helpers ---
const fitFont = (ctx, text, weight, baseSize, maxW, minSize = 16) => {
  let size = baseSize;
  ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
  while (ctx.measureText(text).width > maxW && size > minSize) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
  }
  return size;
};

const drawFitted = (ctx, text, x, y, weight, baseSize, maxW, { align = 'center', color } = {}) => {
  fitFont(ctx, text, weight, baseSize, maxW);
  ctx.textAlign = align;
  if (color) ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

export const splitParentsName = (raw) => {
  const words = (raw || '').trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { line1: `TO, ${words[0] || ''}`, line2: '& FAMILY' };
  let splitIdx = 1;
  let minDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = ('TO, ' + words.slice(0, i).join(' ')).length;
    const right = (words.slice(i).join(' ') + ' & FAMILY').length;
    const diff = Math.abs(left - right);
    if (diff < minDiff) {
      minDiff = diff;
      splitIdx = i;
    }
  }
  return {
    line1: 'TO, ' + words.slice(0, splitIdx).join(' '),
    line2: words.slice(splitIdx).join(' ') + ' & FAMILY'
  };
};

const drawClippedCircle = (ctx, img, cx, cy, radius) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  const aspect = img.width / img.height;
  let sW = img.width;
  let sH = img.height;
  let sX = 0;
  let sY = 0;
  if (aspect > 1) {
    sW = img.height;
    sX = (img.width - img.height) / 2;
  } else {
    sH = img.width;
    sY = (img.height - img.width) / 2;
  }
  ctx.drawImage(img, sX, sY, sW, sH, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
};

const drawLogo = (ctx, logoImg, canvasWidth) => {
  if (!logoImg || !logoImg.width) return;
  const targetWidth = canvasWidth * 0.18;
  const targetHeight = (logoImg.height / logoImg.width) * targetWidth;
  ctx.drawImage(logoImg, canvasWidth - targetWidth - 48, 44, targetWidth, targetHeight);
};

// --- Template renderer (data-driven from theme config) ---
const renderTemplate = async (ctx, theme, { babyImg, logoImg, formData }) => {
  const pal = paletteFor(theme.gender);
  const L = theme.layout;
  const templateImg = await loadImage(theme.template);
  ctx.drawImage(templateImg, 0, 0, theme.width, theme.height);
  drawClippedCircle(ctx, babyImg, theme.photo.cx, theme.photo.cy, theme.photo.radius);

  ctx.fillStyle = pal.primary;
  const { line1, line2 } = splitParentsName(formData.parentsName);
  drawFitted(ctx, line1, L.textCx, L.nameY1, 900, L.nameSize, L.nameMaxW, { color: pal.primary });
  drawFitted(ctx, line2, L.textCx, L.nameY2, 900, L.nameSize, L.nameMaxW, { color: pal.primary });

  ctx.fillStyle = pal.accent;
  ctx.textAlign = 'center';
  L.quote.forEach((line, i) => {
    ctx.font = `500 ${L.quoteSize}px ${FONT_FAMILY}`;
    ctx.fillText(line, L.textCx, L.quoteY + i * L.quoteGap);
  });

  ctx.fillStyle = pal.primary;
  ctx.textAlign = 'center';
  ctx.font = `900 ${L.badgeSize}px ${FONT_FAMILY}`;
  ctx.fillText(`BABY ${pal.word}`, L.textCx, L.badgeY);

  if (theme.drawLogo) drawLogo(ctx, logoImg, theme.width);
};

// --- Public entry point ---
export const renderTheme = async (theme, assets) => {
  await ensureFonts();
  const canvas = document.createElement('canvas');
  canvas.width = theme.width;
  canvas.height = theme.height;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  await renderTemplate(ctx, theme, assets);
  return canvas.toDataURL(theme.export || 'image/png');
};
