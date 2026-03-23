import { getFestivalWishes } from '../constants/festivals';

export const drawLogoIfAvailable = (ctx, logoImg, canvasWidth) => {
  if (logoImg && logoImg.width) {
    const targetWidth = 180;
    const targetHeight = (logoImg.height / logoImg.width) * targetWidth;
    const x = canvasWidth - targetWidth - 40;
    const y = 40;
    const tCanvas = document.createElement('canvas');
    tCanvas.width = targetWidth;
    tCanvas.height = targetHeight;
    const tCtx = tCanvas.getContext('2d');
    tCtx.drawImage(logoImg, 0, 0, targetWidth, targetHeight);
    try {
      const id = tCtx.getImageData(0, 0, targetWidth, targetHeight);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) { if (d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240) d[i + 3] = 0; }
      tCtx.putImageData(id, 0, 0);
      ctx.drawImage(tCanvas, x, y);
    } catch (e) {
      ctx.drawImage(logoImg, x, y, targetWidth, targetHeight);
    }
  }
};

export const generateBabyPremium = async (babyImg, isBoy, logoImg, formData) => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1303;
  const ctx = canvas.getContext('2d');
  const tImg = new Image();
  tImg.src = isBoy ? '/BabyBoy_Template.png' : '/BabyGirl_Template.png';
  await new Promise(r => tImg.onload = r);
  ctx.drawImage(tImg, 0, 0, 2048, 1303);
  const cx = 450, cy = 635, rad = 350;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, Math.PI * 2);
  ctx.clip();
  const aspect = babyImg.width / babyImg.height;
  let sW = babyImg.width, sH = babyImg.height, sX = 0, sY = 0;
  if (aspect > 1) { sW = babyImg.height; sX = (babyImg.width - babyImg.height) / 2; } else { sH = babyImg.width; sY = (babyImg.height - babyImg.width) / 2; }
  ctx.drawImage(babyImg, sX, sY, sW, sH, cx - rad, cy - rad, rad * 2, rad * 2);
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillStyle = isBoy ? '#0B4A8E' : '#D61C6A';
  const drawFitted = (t, y, b, m) => {
    let s = b; ctx.font = `900 ${s}px Satoshi`;
    while (ctx.measureText(t).width > m && s > 20) { s -= 2; ctx.font = `900 ${s}px Satoshi`; }
    ctx.fillText(t, 1420, y);
  };
  const names = formData.parentsName.trim().toUpperCase().split(' ');
  drawFitted("TO, " + names[0], 530, 65, 1000);
  drawFitted((names.slice(1).join(' ') || '') + " & FAMILY", 620, 65, 1000);
  ctx.fillStyle = isBoy ? '#175C9A' : '#C82C75';
  ctx.font = '500 48px Satoshi';
  ctx.fillText('“Warm Welcome for child with Lots of', 1420, 740);
  ctx.fillText('Love & Greetings”', 1420, 810);
  drawLogoIfAvailable(ctx, logoImg, 2048);
  return canvas.toDataURL('image/jpeg', 0.95);
};

export const generateFestivalCreative = async (fest, optionIndex, logoImg) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  const grd = ctx.createRadialGradient(540, 720, 0, 540, 720, 1000);
  grd.addColorStop(0, fest.color + '15');
  grd.addColorStop(1, '#000000');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1080, 1440);
  ctx.strokeStyle = fest.color + '33';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1080, Math.random() * 1440, Math.random() * 300, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 110px Satoshi';
  ctx.fillText(fest.name.toUpperCase(), 540, 320);
  ctx.font = '700 65px Satoshi';
  ctx.fillStyle = fest.color;
  ctx.fillText(fest.gujarati, 540, 400);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '400 44px Satoshi';
  const wishes = getFestivalWishes(fest);
  const wish = wishes[optionIndex];
  const words = wish.split(' ');
  let lines = [], line = '';
  words.forEach(w => {
    if (ctx.measureText(line + w).width < 850) line += w + ' ';
    else { lines.push(line); line = w + ' '; }
  });
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, 540, 680 + i * 65));
  ctx.font = 'italic 700 48px Satoshi';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('PAYAL MATERNITY HOME', 540, 1280);
  drawLogoIfAvailable(ctx, logoImg, 1080);
  return canvas.toDataURL('image/jpeg', 0.95);
};
