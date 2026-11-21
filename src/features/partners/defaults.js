const sheetOne = '/affiliates/affiliates-sheet-1.jpeg';
const sheetTwo = '/affiliates/affiliates-sheet-2.jpeg';

const rowsOne = ['15.5%', '24.7%', '33.8%', '43.7%', '53.5%', '65.1%', '75.7%', '86.4%', '95.2%'];
const rowsTwo = ['16%', '25%', '33.6%', '42.8%', '53.1%', '63.3%', '73%', '83.4%', '94.5%'];

const fromGrid = (sheet, rows, names) => names.map((name, index) => ({
  name,
  sheet,
  x: `${(index % 3) * 50}%`,
  y: rows[Math.floor(index / 3)],
}));

const affiliates = [
  ...fromGrid(sheetOne, rowsOne, [
    'FLAME University', 'Somaiya Vidyavihar University', 'Welingkar Institute of Management',
    'Ashoka University', 'Lovely Professional University', 'Istituto Marangoni',
    'Plaksha University', 'Shiv Nadar University', 'Bennett University',
    'Alliance University', 'NMIMS University', 'GITAM',
    'Goa Institute of Management', 'Manipal Academy of Higher Education', 'Mody University',
    'Indian School of Business & Finance', 'Hult International Business School', 'ITM Skills University',
    'K.R. Mangalam University', 'Badruka Educational Society', 'iNurture Education Solutions',
    'Siva Sivani Institute of Management', 'Accurate Institute', 'School of Innovation and Management',
    'Vidyashilp University', 'Sharda University', 'ASB',
  ]),
  ...fromGrid(sheetTwo, rowsTwo, [
    'Thapar Institute of Engineering & Technology', 'Prestige', 'Jio',
    'S.D. College Institutions', 'Acharya Bangalore B-School', 'Amity University',
    'Planet Finance Business School', 'Poddar Group of Institutions', 'NICMAR University',
    'GNIOT Group of Institutions', 'ISBR Business School', 'Mangalam College of Engineering',
    'Vishwa Vishwani Institute of Systems & Management', 'Parul University', 'RV University',
    'SRM Institute of Science and Technology', 'Kirloskar', 'Pimpri Chinchwad University',
    'Graphic Era University', 'BML Munjal University', 'IFIM Institutions',
    'IILM University', 'Chitkara Business School', 'Lloyd Institute',
    'Jagdish Sheth School of Management', 'Indian School of Development Management', 'Sparsh Global Business School',
  ]),
  { name: 'Pearl Academy', sheet: sheetTwo, x: '50%', y: '89.4%' },
];

export const partnerDefaults = affiliates.map(({ name, sheet, x, y }) => ({ name, image: sheet, logoPosition: `${x} ${y}`, website: '', location: '' }));
