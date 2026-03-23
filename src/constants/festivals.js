export const FESTIVALS = [
  { id: 'uttarayan', name: 'Uttarayan', gujarati: 'ઉતરાયણ', date: 'Jan 14', color: '#87CEEB', hook: '“Kaypo Chhe!”' },
  { id: 'republic-day', name: 'Republic Day', gujarati: 'પ્રજાસત્તાક દિન', date: 'Jan 26', color: '#FF9933', hook: '“Proud Indian”' },
  { id: 'mahashivratri', name: 'Mahashivratri', gujarati: 'મહાશિવરાત્રી', date: 'Feb 15', color: '#9370DB', hook: '“Divine Energy”' },
  { id: 'dhuleti', name: 'Holi (Dhuleti)', gujarati: 'ધુળેટી', date: 'Mar 4', color: '#FF69B4', hook: '“Colors of Joy”' },
  { id: 'ram-navami', name: 'Ram Navami', gujarati: 'રામ નવમી', date: 'Mar 27', color: '#FFBD33', hook: '“Virtue & Glory”' },
  { id: 'akshatritiya', name: 'Akshatritiya', gujarati: 'અક્ષય તૃતીયા', date: 'Apr 19', color: '#FFD700', hook: '“Auspicious Starts”' },
  { id: 'gujarat-day', name: 'Gujarat Day', gujarati: 'ગુજરાત સ્થાપના દિન', date: 'May 1', color: '#32CD32', hook: '“Garvi Gujarat”' },
  { id: 'gauri-vrat', name: 'Gauri Vrat', gujarati: 'ગૌરી વ્રત', date: 'July 1', color: '#FF69B4', hook: '“Javarana”' },
  { id: 'rath-yatra', name: 'Rath Yatra', gujarati: 'રથયાત્રા', date: 'July 16', color: '#FF8C00', hook: '“Divine Journey”' },
  { id: 'independence-day', name: 'Independence Day', gujarati: 'સ્વતંત્રતા દિવસ', date: 'Aug 15', color: '#FF9933', hook: '“Tiranga Pride”' },
  { id: 'janmashtami', name: 'Janmashtami', gujarati: 'જન્માષ્ટમી', date: 'Sept 4', color: '#4169E1', hook: '“Haathi Ghoda Paalkhi”' },
  { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', gujarati: 'ગણેશ ચતુર્થી', date: 'Sept 14', color: '#FFD700', hook: '“Bappa Morya”' },
  { id: 'navratri', name: 'Navratri', gujarati: 'નવરાત્રી', date: 'Sept 22', color: '#FF8C00', hook: '“Divine Garba”' },
  { id: 'dussehra', name: 'Dussehra', gujarati: 'દશેરા', date: 'Oct 2', color: '#FF4500', hook: '“Victory of Good”' },
  { id: 'dhanteras', name: 'Dhanteras', gujarati: 'ધનતેરસ', date: 'Oct 18', color: '#FFD700', hook: '“Prosperity & Wealth”' },
  { id: 'diwali', name: 'Diwali', gujarati: 'દિવાળી', date: 'Oct 20', color: '#FFD700', hook: '“Festival of Lights”' },
  { id: 'bestu-varas', name: 'Bestu Varas (NY)', gujarati: 'બેસતું વર્ષ', date: 'Oct 22', color: '#32CD32', hook: '“Saal Mubarak”' },
  { id: 'bhai-dooj', name: 'Bhai Dooj', gujarati: 'ભાઈબીજ', date: 'Oct 23', color: '#DC143C', hook: '“Bonds of Protection”' },
  { id: 'dev-diwali', name: 'Dev Diwali', gujarati: 'દેવ દિવાળી', date: 'Nov 5', color: '#9370DB', hook: '“Divine Celebration”' },
  { id: 'christmas', name: 'Christmas', gujarati: 'નાતાલ', date: 'Dec 25', color: '#008000', hook: '“Joy & Peace”' }
];

export const getFestivalWishes = (fest) => {
  const common = [
    `May this ${fest.name} fill your life with love, health, and infinite blessings. Wishing you a beautiful journey of motherhood and new beginnings.`,
    `As we celebrate ${fest.name}, we wish your family health, prosperity, and the joy of new life. Happy ${fest.name} from Payal Maternity Home.`
  ];

  if (fest.id === 'janmashtami') return [...common, `Haathi Ghoda Paalkhi, Jai Kanhaiya Laal Ki! May the miracle of birth bring immense joy to your world. Happy Janmashtami.`];
  if (fest.id === 'navratri') return [...common, `May the nine forms of Mother Shakti bless your nine months of pregnancy and lead to a healthy, safe arrival. Happy Navratri.`];
  if (fest.id === 'uttarayan') return [...common, `Kaypo Chhe! May your family's joy fly as high as the kites in the sky. Wishing you heights of health and harmony this Makar Sankranti.`];
  if (fest.id === 'bestu-varas') return [...common, `Nutan Varshabhinandan! May this new year bring a bundle of joy to your doorstep. Best wishes for your motherhood journey.`];

  return [...common, `Bringing new life into the world is the greatest celebration. May the light of ${fest.name} brighten your path to motherhood. Best wishes.`];
};
