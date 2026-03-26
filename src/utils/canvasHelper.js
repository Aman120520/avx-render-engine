import { getFestivalWishes } from '../constants/festivals';

// --- Global Helpers ---
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

export const drawClippedImage = (ctx, img, cx, cy, radius) => {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
  const imgAspect = img.width / img.height;
  let sWidth = img.width, sHeight = img.height, sX = 0, sY = 0;
  if (imgAspect > 1) { sWidth = img.height; sX = (img.width - img.height) / 2; }
  else { sHeight = img.width; sY = (img.height - img.width) / 2; }
  ctx.drawImage(img, sX, sY, sWidth, sHeight, cx - radius, cy - radius, radius * 2, radius * 2); ctx.restore();
};

// --- Variant 1: Template Based (Classic Premium) ---
export const generateTemplateBased = async (babyImg, isBoy, logoImg, formData) => {
  const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1303; const ctx = canvas.getContext('2d');
  const templateImg = new Image(); templateImg.src = isBoy ? '/BabyBoy_Template.png' : '/BabyGirl_Template.png';
  await new Promise(r => templateImg.onload = r);
  ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
  const cx = 450, cy = 635, radius = 350;
  drawClippedImage(ctx, babyImg, cx, cy, radius);
  const textCx = 1420; const textColor = isBoy ? '#0B4A8E' : '#D61C6A'; const quoteColor = isBoy ? '#175C9A' : '#C82C75';
  ctx.textAlign = 'center'; ctx.fillStyle = textColor;
  const words = formData.parentsName.trim().toUpperCase().split(' ');
  let line1 = "TO, ", line2 = "& FAMILY";
  if (words.length === 1) { line1 += words[0] || ''; }
  else {
    let splitIdx = 1; let minDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const diff = Math.abs(("TO, " + words.slice(0, i).join(' ')).length - (words.slice(i).join(' ') + " & FAMILY").length);
      if (diff < minDiff) { minDiff = diff; splitIdx = i; }
    }
    line1 = "TO, " + words.slice(0, splitIdx).join(' ');
    line2 = words.slice(splitIdx).join(' ') + " & FAMILY";
  }
  const drawFitted = (text, y, baseSize, maxW) => {
    let size = baseSize; ctx.font = `900 ${size}px Satoshi`;
    while (ctx.measureText(text).width > maxW && size > 20) { size -= 2; ctx.font = `900 ${size}px Satoshi`; }
    ctx.fillText(text, textCx, y);
  };
  drawFitted(line1, 530, 65, 1000); drawFitted(line2, 620, 65, 1000);
  ctx.fillStyle = quoteColor; ctx.font = '500 48px Satoshi';
  ctx.fillText('“Warm Welcome for child with Lots of', textCx, 740);
  ctx.fillText('Love & Greetings”', textCx, 810);
  return canvas.toDataURL('image/jpeg', 0.95);
};

// --- Variant 2: Minimalist Modern ---
export const generateMinimalist = async (babyImg, isBoy, logoImg, formData) => {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800; const ctx = canvas.getContext('2d');
  ctx.fillStyle = isBoy ? '#F0F4F8' : '#FFF0F5'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = isBoy ? '#E1EBF5' : '#FFE4ED'; ctx.beginPath(); ctx.arc(0, 800, 400, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(1200, 0, 300, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(100, 100, 450, 600, 20); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.save(); ctx.beginPath(); ctx.roundRect(120, 120, 410, 410, 10); ctx.clip(); const imgAspect = babyImg.width / babyImg.height; let sW = babyImg.width, sH = babyImg.height, sX = 0, sY = 0; if (imgAspect > 1) { sW = babyImg.height; sX = (babyImg.width - babyImg.height) / 2; } else { sH = babyImg.width; sY = (babyImg.height - babyImg.width) / 2; } ctx.drawImage(babyImg, sX, sY, sW, sH, 120, 120, 410, 410); ctx.restore();
  ctx.fillStyle = isBoy ? '#475569' : '#831843'; ctx.font = 'italic 24px Satoshi'; ctx.textAlign = 'center'; ctx.fillText('A Beautiful Blessing', 325, 600); ctx.font = 'bold 36px Satoshi'; ctx.fillText(`IT'S A ${isBoy ? 'BOY' : 'GIRL'}!`, 325, 650);
  ctx.textAlign = 'left'; ctx.fillStyle = isBoy ? '#1E293B' : '#4C0519'; ctx.font = '900 64px Satoshi'; ctx.fillText('WELCOME', 620, 250); ctx.fillStyle = isBoy ? '#3B82F6' : '#E11D48'; ctx.font = '600 32px Satoshi'; ctx.fillText('TO THE FAMILY', 625, 290);
  ctx.fillStyle = '#64748B'; ctx.font = 'italic 28px Satoshi'; ctx.fillText(`Warmest congratulations to:`, 620, 380); ctx.fillStyle = isBoy ? '#0F172A' : '#4C0519';
  const words = formData.parentsName.trim().toUpperCase().split(' '); let splitIdx = Math.ceil(words.length / 2) || 1;
  const drawFitted = (text, y, baseSize, maxW) => { let size = baseSize; ctx.font = `900 ${size}px Satoshi`; while (ctx.measureText(text).width > maxW && size > 16) { size -= 2; ctx.font = `900 ${size}px Satoshi`; } ctx.fillText(text, 620, y); };
  drawFitted(words.slice(0, splitIdx).join(' '), 430, 40, 500); drawFitted(words.slice(splitIdx).join(' '), 480, 40, 500);
  ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.05)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5; ctx.beginPath(); ctx.roundRect(620, 540, 480, 160, 20); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#64748B'; ctx.font = '600 16px Satoshi'; ctx.fillText('DATE', 660, 580); ctx.fillText('TIME', 900, 580); ctx.fillText('WEIGHT', 660, 650); ctx.fillText('PACKAGE', 900, 650);
  ctx.fillStyle = isBoy ? '#1E293B' : '#4C0519'; ctx.font = 'bold 24px Satoshi'; ctx.fillText(formData.date, 660, 610); ctx.fillText(formData.time, 900, 610); ctx.fillText(`${formData.weight} KG`, 660, 680); ctx.fillText(formData.package || 'STANDARD', 900, 680);
  drawLogoIfAvailable(ctx, logoImg, 1200);
  return canvas.toDataURL('image/jpeg', 0.95);
};

// --- Variant 3: Vibrant Announcement ---
export const generateVibrant = async (babyImg, isBoy, logoImg, formData) => {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800; const ctx = canvas.getContext('2d');
  const grd = ctx.createLinearGradient(0, 0, 1200, 800); grd.addColorStop(0, isBoy ? '#38BDF8' : '#F472B6'); grd.addColorStop(1, isBoy ? '#0284C7' : '#BE185D'); ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(100, 100, 300, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(1100, 700, 400, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(850, 400, 280, 0, Math.PI * 2); ctx.fill(); ctx.shadowColor = 'transparent';
  drawClippedImage(ctx, babyImg, 850, 400, 265);
  ctx.textAlign = 'left'; ctx.fillStyle = '#FFFFFF'; ctx.font = '900 80px Satoshi'; ctx.fillText(`IT'S A ${isBoy ? 'BOY' : 'GIRL'}!`, 80, 220);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'italic 30px Satoshi'; ctx.fillText(`Welcome to the world,`, 80, 280);
  const words = formData.parentsName.trim().toUpperCase().split(' '); let splitIdx = Math.ceil(words.length / 2) || 1;
  const drawFitted = (text, y, baseSize, maxW) => { let size = baseSize; ctx.font = `900 ${size}px Satoshi`; while (ctx.measureText(text).width > maxW && size > 16) { size -= 2; ctx.font = `900 ${size}px Satoshi`; } ctx.fillText(text, 80, y); };
  drawFitted(words.slice(0, splitIdx).join(' '), 360, 50, 450); drawFitted(words.slice(splitIdx).join(' ') + " & FAMILY", 420, 50, 450);
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.roundRect(80, 580, 460, 140, 25); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 22px Satoshi'; ctx.fillText(`📅 Date: ${formData.date}`, 110, 625); ctx.fillText(`⏰ Time: ${formData.time}`, 110, 680); ctx.fillText(`⚖️ Weight: ${formData.weight} Kg`, 300, 625); ctx.fillText(`🎁 Pkg: ${formData.package || 'STANDARD'}`, 300, 680);
  drawLogoIfAvailable(ctx, logoImg, 1200);
  return canvas.toDataURL('image/jpeg', 0.95);
};


// --- Festival Logic (Payal Maternity Brand Style) ---
export const generateFestivalCreative = async (fest, optionIndex, logoImg) => {
  const W = 1080, H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const PINK = '#E91E63'; // The specific pink from the image
  const DARK = '#1a1a2e';

  // --- Background: Clean gradient based on festival color ---
  const bgGrd = ctx.createLinearGradient(0, 0, 0, H);
  bgGrd.addColorStop(0, '#ffffff');
  bgGrd.addColorStop(0.5, fest.color + '10');
  bgGrd.addColorStop(1, fest.color + '20');
  ctx.fillStyle = bgGrd;
  ctx.fillRect(0, 0, W, H);

  // --- Header: Left Badge ---
  const badgeX = 120, badgeY = 120;
  // Pink Circle
  ctx.fillStyle = PINK;
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 80, 0, Math.PI * 2);
  ctx.fill();
  
  // Badge Text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Delivering Excellence', badgeX, badgeY - 35);
  ctx.font = 'bold 18px Arial';
  ctx.fillText('SINCE', badgeX, badgeY - 5);
  ctx.font = '900 48px Arial';
  ctx.fillText('1998', badgeX, badgeY + 40);
  
  // Hashtag Pill
  const pillW = 200, pillH = 35;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(badgeX - pillW/2, badgeY + 90, pillW, pillH, 17);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = PINK;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('#pregnancy_means_payal', badgeX, badgeY + 112);

  // --- Header: Right Logo ---
  if (logoImg && logoImg.width) {
    const lW = 320;
    const lH = (logoImg.height / logoImg.width) * lW;
    ctx.drawImage(logoImg, W - lW - 40, 40, lW, lH);
  }

  // --- Central Content: Festival Wishing ---
  const contentY = 550;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#888';
  ctx.font = 'italic 500 50px Arial';
  ctx.fillText('wishing you a very happy', W / 2, contentY);

  let titleSize = 130;
  ctx.font = `900 ${titleSize}px Arial`;
  while (ctx.measureText(fest.name.toUpperCase()).width > W - 100 && titleSize > 60) {
    titleSize -= 5;
    ctx.font = `900 ${titleSize}px Arial`;
  }
  ctx.fillStyle = DARK;
  ctx.fillText(fest.name.toUpperCase(), W / 2, contentY + titleSize);

  // Divider line
  ctx.fillStyle = PINK;
  ctx.fillRect(W / 2 - 80, contentY + titleSize + 50, 160, 5);

  const wishes = getFestivalWishes(fest);
  const wish = wishes[Math.min(optionIndex, wishes.length - 1)];
  ctx.fillStyle = '#444';
  ctx.font = '500 34px Arial';
  const words = wish.split(' ');
  let lines = [], line = '';
  words.forEach(w => {
    if (ctx.measureText(line + w).width < W - 240) { line += w + ' '; }
    else { lines.push(line.trim()); line = w + ' '; }
  });
  if (line) lines.push(line.trim());
  lines.forEach((l, i) => ctx.fillText(l, W / 2, contentY + titleSize + 130 + (i * 55)));

  // --- Footer ---
  const footerH = 220;
  const fY = H - footerH;
  ctx.fillStyle = PINK;
  ctx.fillRect(0, fY, W, footerH);

  // White Divider
  ctx.strokeStyle = '#ffffff80';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2, fY + 30); ctx.lineTo(W/2, fY + 190); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px Arial';
  ctx.fillText('Helpline: +91 89051 50606', W/4 + 20, fY + 70);
  ctx.fillText('Helpline: +91 75750 10400', 3*W/4 - 20, fY + 70);

  ctx.font = '500 24px Arial';
  ctx.fillText('📍 Regional Branch: 1st Floor, West Gate Complex,', W/4 + 20, fY + 120);
  ctx.fillText('Near Raiya Circle, 150ft. Ring Road, Rajkot', W/4 + 20, fY + 160);

  ctx.fillText('📍 Branch: 4th Floor, One Mavdi Complex, Near Bapa', 3*W/4 - 20, fY + 120);
  ctx.fillText('Sitaram Chowk, Mavadi - Pal Road, Rajkot', 3*W/4 - 20, fY + 160);

  // Black Swoosh Bottom Right
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(W, H);
  ctx.quadraticCurveTo(W - 100, H - 20, W - 250, H - 100);
  ctx.lineTo(W, H - 100);
  ctx.fill();

  return canvas.toDataURL('image/jpeg', 0.95);
};

// --- AI Generated Festival Creative (Simplified Logo Overlay) ---
export const generateAIFestivalImage = async (aiImg, fest, logoImg) => {
  const W = 1080, H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const PINK = '#E91E63';

  // Draw the AI Image with Cover Effect
  const imgAspect = aiImg.width / aiImg.height;
  const canvasAspect = W / H;
  let sW, sH, sX, sY;

  if (imgAspect > canvasAspect) {
    sH = aiImg.height;
    sW = aiImg.height * canvasAspect;
    sX = (aiImg.width - sW) / 2;
    sY = 0;
  } else {
    sW = aiImg.width;
    sH = aiImg.width / canvasAspect;
    sX = 0;
    sY = (aiImg.height - sH) / 2;
  }
  ctx.drawImage(aiImg, sX, sY, sW, sH, 0, 0, W, H);

  // --- Header Overlay: Badge (Left) ---
  const badgeX = 120, badgeY = 120;
  ctx.fillStyle = PINK;
  ctx.beginPath(); ctx.arc(badgeX, badgeY, 80, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px Arial'; ctx.fillText('Delivering Excellence', badgeX, badgeY - 35);
  ctx.font = 'bold 18px Arial'; ctx.fillText('SINCE', badgeX, badgeY - 5);
  ctx.font = '900 48px Arial'; ctx.fillText('1998', badgeX, badgeY + 40);
  
  // Hashtag Pill
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.roundRect(badgeX - 100, badgeY + 90, 200, 35, 17); ctx.fill();
  ctx.fillStyle = PINK;
  ctx.font = 'bold 14px Arial'; ctx.fillText('#pregnancy_means_payal', badgeX, badgeY + 112);

  // --- Header Overlay: Logo (Right) ---
  if (logoImg && logoImg.width) {
    const lW = 320;
    const lH = (logoImg.height / logoImg.width) * lW;
    ctx.drawImage(logoImg, W - lW - 40, 40, lW, lH);
  }

  // --- Footer Overlay ---
  const footerH = 220;
  const fY = H - footerH;
  ctx.fillStyle = PINK;
  ctx.fillRect(0, fY, W, footerH);

  ctx.strokeStyle = '#ffffff80';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2, fY + 30); ctx.lineTo(W/2, fY + 190); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px Arial';
  ctx.fillText('Helpline: +91 89051 50606', W/4 + 20, fY + 70);
  ctx.fillText('Helpline: +91 75750 10400', 3*W/4 - 20, fY + 70);

  ctx.font = '500 24px Arial';
  ctx.fillText('📍 Regional Branch: 1st Floor, West Gate Complex,', W/4 + 20, fY + 120);
  ctx.fillText('Near Raiya Circle, 150ft. Ring Road, Rajkot', W/4 + 20, fY + 160);

  ctx.fillText('📍 Branch: 4th Floor, One Mavdi Complex, Near Bapa', 3*W/4 - 20, fY + 120);
  ctx.fillText('Sitaram Chowk, Mavadi - Pal Road, Rajkot', 3*W/4 - 20, fY + 160);

  // Black Swoosh Bottom Right
  ctx.fillStyle = '#000000';
  ctx.beginPath(); ctx.moveTo(W, H); ctx.quadraticCurveTo(W - 100, H - 20, W - 250, H - 100); ctx.lineTo(W, H - 100); ctx.fill();

  return canvas.toDataURL('image/jpeg', 0.9);
};
