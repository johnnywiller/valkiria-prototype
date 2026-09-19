/* Valkirias Events — pricing data (prototype figures, all in EUR) */

const CITIES = [
  {
    id: "madrid",
    name: "Madrid",
    region: "Central Spain",
    basePrice: 3200,
    multiplier: 1.00,
    tagline: "Endless venues, from royal palaces to pine forest clearings.",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    region: "Catalonia",
    basePrice: 4000,
    multiplier: 1.20,
    tagline: "Gaudí backdrops and Mediterranean light — our busiest market.",
  },
  {
    id: "valencia",
    name: "Valencia",
    region: "Levante",
    basePrice: 2900,
    multiplier: 0.95,
    tagline: "Orange groves, coastline and a laid-back festival spirit.",
  },
  {
    id: "sevilla",
    name: "Sevilla",
    region: "Andalucía",
    basePrice: 3100,
    multiplier: 1.05,
    tagline: "Moorish courtyards and orange-blossom evenings.",
  },
  {
    id: "north",
    name: "North Spain",
    region: "Asturias & Cantabria",
    basePrice: 2700,
    multiplier: 0.90,
    tagline: "Green cliffs, misty forests — built for Viking and Celtic sagas.",
  },
  {
    id: "south",
    name: "South Spain",
    region: "Costa del Sol & inland Andalucía",
    basePrice: 3600,
    multiplier: 1.15,
    tagline: "Sun-baked coastline with a premium resort scene.",
  },
  {
    id: "zaragoza",
    name: "Zaragoza",
    region: "Aragón",
    basePrice: 2500,
    multiplier: 0.85,
    tagline: "Our best value city — riverside venues, smaller crowds.",
  },
  {
    id: "malaga",
    name: "Málaga",
    region: "Costa del Sol",
    basePrice: 3400,
    multiplier: 1.10,
    tagline: "Beachfront ceremonies with a lively old-town backdrop.",
  },
];

const THEMES = [
  {
    id: "viking",
    name: "Viking Saga",
    icon: "⚔️",
    basePrice: 2800,
    tagline: "Longships, runes and a mead-soaked feast hall.",
    excludedCities: [],
  },
  {
    id: "medieval",
    name: "Medieval Kingdom",
    icon: "🏰",
    basePrice: 2600,
    tagline: "Banners, jousting grounds and a castle-worthy banquet.",
    excludedCities: [],
  },
  {
    id: "eden",
    name: "Garden of Eden",
    icon: "🌿",
    basePrice: 2400,
    tagline: "Lush greenery, gilded serpents and a forbidden-fruit feast.",
    excludedCities: ["north"],
  },
  {
    id: "celtic",
    name: "Celtic Legend",
    icon: "🍀",
    basePrice: 2500,
    tagline: "Stone circles, bagpipes and an ancient druid blessing.",
    excludedCities: [],
  },
  {
    id: "frozen",
    name: "Frozen Kingdom",
    icon: "❄️",
    basePrice: 3200,
    tagline: "An ice-palace aesthetic with crystal decor and snow effects.",
    excludedCities: ["malaga", "south"],
  },
  {
    id: "pirates",
    name: "Pirate's Cove",
    icon: "🏴‍☠️",
    basePrice: 2700,
    tagline: "A rogue's harbor wedding with rum, rope and a ship-deck altar.",
    excludedCities: ["madrid", "zaragoza", "sevilla"],
  },
  {
    id: "egypt",
    name: "Ancient Egypt",
    icon: "🏺",
    basePrice: 3000,
    tagline: "Golden pharaohs, sand-swept aisles and pyramid backdrops.",
    excludedCities: ["zaragoza"],
  },
  {
    id: "greek",
    name: "Greek Mythology",
    icon: "🏛️",
    basePrice: 2900,
    tagline: "Marble columns, laurel wreaths and an Olympian banquet.",
    excludedCities: [],
  },
];

const EXTRAS = [
  { id: "horses", name: "Live Horses & Riders", icon: "🐴", category: "Animals & Arrivals", basePrice: 900, tagline: "A mounted honor guard or a dramatic entrance.", excludedCities: ["barcelona"] },
  { id: "carriage", name: "Carriage Arrival", icon: "🛞", category: "Animals & Arrivals", basePrice: 1100, tagline: "Arrive in a horse-drawn carriage fit for royalty.", excludedCities: ["barcelona"] },
  { id: "falconry", name: "Falconry Display", icon: "🦅", category: "Animals & Arrivals", basePrice: 750, tagline: "Trained hawks and falcons soaring over the ceremony.", excludedCities: ["valencia", "barcelona"] },
  { id: "snake", name: "Snake Charmer", icon: "🐍", category: "Animals & Arrivals", basePrice: 400, tagline: "A hypnotic touch — a favorite for Eden and Egypt themes.", excludedCities: ["madrid", "north", "zaragoza"] },

  { id: "quartet", name: "String Quartet", icon: "🎻", category: "Music", basePrice: 700, tagline: "Live strings for the ceremony and cocktail hour.", excludedCities: [] },
  { id: "bagpipes", name: "Bagpipe Band", icon: "🎺", category: "Music", basePrice: 650, tagline: "Rousing highland pipes to open the celebration.", excludedCities: [] },
  { id: "drummers", name: "Drummers & War Horns", icon: "🥁", category: "Music", basePrice: 600, tagline: "Tribal percussion for a warrior's entrance.", excludedCities: [] },
  { id: "dj", name: "DJ & Dance Floor", icon: "🎧", category: "Music", basePrice: 800, tagline: "Keep the feast going long into the night.", excludedCities: [] },

  { id: "fire", name: "Fire Performers", icon: "🔥", category: "Performers", basePrice: 850, tagline: "Fire eaters and torch dancers for the finale.", excludedCities: [] },
  { id: "knights", name: "Knight Duel Show", icon: "⚔️", category: "Performers", basePrice: 950, tagline: "Choreographed sword combat between the vows and the feast.", excludedCities: ["zaragoza"] },
  { id: "acrobats", name: "Aerial Acrobats", icon: "🎪", category: "Performers", basePrice: 1200, tagline: "Silk and hoop performers above the dance floor.", excludedCities: ["madrid", "zaragoza"] },
  { id: "magician", name: "Magician & Illusionist", icon: "🎩", category: "Performers", basePrice: 500, tagline: "Close-up magic table to table during cocktails.", excludedCities: [] },
  { id: "storyteller", name: "Bardic Storyteller", icon: "📜", category: "Performers", basePrice: 400, tagline: "A bard narrates your love story in verse.", excludedCities: [] },
  { id: "tarot", name: "Tarot & Fortune Reader", icon: "🔮", category: "Performers", basePrice: 300, tagline: "A mystic corner for guests during the reception.", excludedCities: [] },
  { id: "blacksmith", name: "Blacksmith Demo", icon: "🔨", category: "Performers", basePrice: 450, tagline: "A working forge — guests can strike the ceremonial blade.", excludedCities: ["valencia"] },
  { id: "archery", name: "Archery Range", icon: "🏹", category: "Performers", basePrice: 500, tagline: "A supervised range for guests to try their aim.", excludedCities: ["barcelona"] },

  { id: "mead", name: "Mead & Wine Tasting", icon: "🍯", category: "Atmosphere & Decor", basePrice: 550, tagline: "A curated tasting station of mead, wine and spiced cider.", excludedCities: [] },
  { id: "henna", name: "Henna & Face Painting", icon: "🎨", category: "Atmosphere & Decor", basePrice: 350, tagline: "A decor artist for guests, themed to your wedding.", excludedCities: [] },
  { id: "ice", name: "Ice Sculptor", icon: "🧊", category: "Atmosphere & Decor", basePrice: 600, tagline: "A live-carved centerpiece — best suited to cooler climates.", excludedCities: ["malaga", "south", "sevilla", "valencia"] },
  { id: "calligraphy", name: "Calligraphy Invitations", icon: "✒️", category: "Atmosphere & Decor", basePrice: 300, tagline: "Hand-lettered invitations and place cards.", excludedCities: [] },

  { id: "fireworks", name: "Fireworks Finale", icon: "🎆", category: "Special Effects", basePrice: 1800, tagline: "A synchronized fireworks display to close the night.", excludedCities: ["zaragoza"] },
  { id: "confetti", name: "Confetti Cannon Send-off", icon: "🎊", category: "Special Effects", basePrice: 250, tagline: "A themed confetti send-off as you leave.", excludedCities: [] },
  { id: "dove", name: "Dove Release", icon: "🕊️", category: "Special Effects", basePrice: 400, tagline: "A classic symbolic release after the vows.", excludedCities: [] },

  { id: "drone", name: "Drone Cinematic Footage", icon: "🚁", category: "Media & Keepsakes", basePrice: 950, tagline: "Aerial footage of the venue and ceremony.", excludedCities: ["north"] },
  { id: "photobooth", name: "Themed Photo Booth", icon: "📸", category: "Media & Keepsakes", basePrice: 450, tagline: "Props and backdrop matched to your theme.", excludedCities: [] },
];

const VAT_RATE = 0.21;
const DEPOSIT_RATE = 0.30;

function priceForCity(basePrice, city) {
  return Math.round((basePrice * city.multiplier) / 10) * 10;
}

function isAvailableInCity(item, cityId) {
  return !item.excludedCities.includes(cityId);
}
