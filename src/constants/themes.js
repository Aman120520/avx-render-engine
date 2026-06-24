// Theme registry for baby arrival cards.
// To add a new template theme: drop the PNG in /public, append one entry below
// with its native size and element coordinates. No frontend changes needed.

export const PALETTES = {
  boy: {
    primary: '#0B4A8E',
    accent: '#175C9A',
    soft: '#EEF4FB',
    softAlt: '#DCE8F7',
    grad: ['#5AB6F0', '#0B6FBF'],
    badgeBg: '#0B4A8E',
    label: '#5B6B7F',
    value: '#10243B',
    word: 'BOY'
  },
  girl: {
    primary: '#D61C6A',
    accent: '#C82C75',
    soft: '#FFF1F7',
    softAlt: '#FFDCEC',
    grad: ['#F77FB6', '#C01F66'],
    badgeBg: '#D61C6A',
    label: '#9D5276',
    value: '#4C0519',
    word: 'GIRL'
  }
};

const classicLayout = {
  textCx: 1420,
  nameMaxW: 1020,
  nameSize: 66,
  nameY1: 520,
  nameY2: 612,
  quote: ['“Warm welcome to your child with', 'lots of love & greetings”'],
  quoteSize: 46,
  quoteY: 728,
  quoteGap: 66,
  badgeY: 950,
  badgeSize: 60
};

export const THEMES = [
  {
    id: 'classic-boy',
    label: 'Classic Premium',
    type: 'template',
    gender: 'boy',
    template: '/BabyBoy_Template.png',
    width: 2048,
    height: 1303,
    export: 'image/png',
    drawLogo: false,
    photo: { cx: 450, cy: 635, radius: 350 },
    layout: classicLayout
  },
  {
    id: 'classic-girl',
    label: 'Classic Premium',
    type: 'template',
    gender: 'girl',
    template: '/BabyGirl_Template.png',
    width: 2048,
    height: 1303,
    export: 'image/png',
    drawLogo: false,
    photo: { cx: 450, cy: 635, radius: 350 },
    layout: classicLayout
  }
];

export const getThemesForGender = (gender) => {
  const key = gender === 'female' || gender === 'girl' ? 'girl' : 'boy';
  return THEMES.filter((t) => t.gender === key || t.gender === 'any');
};

export const paletteFor = (gender) =>
  gender === 'female' || gender === 'girl' ? PALETTES.girl : PALETTES.boy;
