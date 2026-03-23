export const FESTIVALS = [
  { id: 'diwali', name: 'Diwali', gujarati: 'દિવાળી', theme: 'Lights & Prosperity', color: '#FFD700' },
  { id: 'navratri', name: 'Navratri', gujarati: 'નવરાત્રી', theme: 'Divine Rhythms', color: '#FF8C00' },
  { id: 'janmashtami', name: 'Janmashtami', gujarati: 'જન્માષ્ટમી', theme: 'Miracle of Life', color: '#4169E1' },
  { id: 'mahashivratri', name: 'Mahashivratri', gujarati: 'મહાશિવરાત્રી', theme: 'Divine Energy', color: '#9370DB' },
  { id: 'holika-dahan', name: 'Holika Dahan', gujarati: 'હોળી', theme: 'Purity & Victory', color: '#FF4500' },
  { id: 'dhuleti', name: 'Dhuleti', gujarati: 'ધુળેટી', theme: 'Colors of Joy', color: '#FF69B4' },
  { id: 'bestu-varas', name: 'Bestu Varas', gujarati: 'બેસતું વર્ષ', theme: 'New Beginnings', color: '#32CD32' },
  { id: 'uttarayan', name: 'Uttarayan', gujarati: 'ઉતરાયણ', theme: 'Heights of Harmony', color: '#87CEEB' },
  { id: 'rakshabandhan', name: 'Raksha Bandhan', gujarati: 'રક્ષાબંધન', theme: 'Bonds of Protection', color: '#DC143C' },
  { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', gujarati: 'ગણેશ ચતુર્થી', theme: 'Auspicious Starts', color: '#FFD700' },
  { id: 'ram-navami', name: 'Ram Navami', gujarati: 'રામ નવમી', theme: 'Virtue & Glory', color: '#FFBD33' }
];

export const getFestivalWishes = (fest) => [
  `May this ${fest.name} fill your life with love, health, and infinite blessings. Wishing you a beautiful journey of motherhood and new beginnings.`,
  `As we celebrate ${fest.name}, we wish your family health, prosperity, and the joy of new life. Happy ${fest.name} from Payal Maternity Home.`,
  `Bringing new life into the world is the greatest celebration. May the light of ${fest.name} brighten your path to motherhood. Best wishes.`
];
