/**
 * AGRO-TWIN — Core State & Agronomic Logic Service
 * Provides modular user onboarding, session persistence,
 * user data isolation, crop knowledge base, and agronomic simulation logic.
 */

const AgroTwinState = (function () {
  const CURRENT_USER_KEY = 'agrotwin_current_session';
  const USERS_STORE_KEY = 'agrotwin_registered_users';
  const FARMS_STORE_PREFIX = 'agrotwin_farm_data_';

  // ============================================================
  // CROP KNOWLEDGE BASE — agronomic parameters for Indian crops
  // ============================================================
  const CROP_DATABASE = {
    'Tomato': {
      scientificName: 'Solanum lycopersicum',
      defaultVariety: 'Arka Rakshak (F1 Hybrid)',
      family: 'Solanaceae',
      waterNeed: 10,        // L/m² per cycle baseline
      growthStages: ['Seedling', 'Vegetative', 'Flowering / Fruit Set', 'Ripening', 'Harvest'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Red Sandy Loam', 'Alluvial Loam', 'Black Cotton Soil'],
      irrigationMethods: ['Drip (1.6 L/h)', 'Furrow', 'Sprinkler'],
      season: 'Kharif / Rabi',
      daysToMaturity: 90,
      yieldPerHa: '25–40 tonnes',
      cropIcon: 'nutrition'
    },
    'Rice': {
      scientificName: 'Oryza sativa',
      defaultVariety: 'Swarna (MTU 7029)',
      family: 'Poaceae',
      waterNeed: 18,
      growthStages: ['Nursery', 'Transplanting', 'Tillering', 'Panicle Initiation', 'Flowering', 'Grain Filling', 'Harvest'],
      optimalSoilPH: '5.5–6.5',
      idealSoilTypes: ['Clay Loam', 'Alluvial Soil', 'Laterite'],
      irrigationMethods: ['Flood (Paddy)', 'AWD (Alternate Wetting & Drying)', 'SRI Method'],
      season: 'Kharif',
      daysToMaturity: 120,
      yieldPerHa: '4–6 tonnes',
      cropIcon: 'grass'
    },
    'Wheat': {
      scientificName: 'Triticum aestivum',
      defaultVariety: 'HD-3226 (Pusa Yashasvi)',
      family: 'Poaceae',
      waterNeed: 8,
      growthStages: ['Germination', 'Tillering', 'Jointing', 'Heading', 'Grain Fill', 'Maturity'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Alluvial Loam', 'Clay Loam', 'Sandy Loam'],
      irrigationMethods: ['Sprinkler', 'Flood', 'Drip'],
      season: 'Rabi',
      daysToMaturity: 135,
      yieldPerHa: '4–5 tonnes',
      cropIcon: 'grain'
    },
    'Cotton': {
      scientificName: 'Gossypium hirsutum',
      defaultVariety: 'Bt Cotton (Bollgard II)',
      family: 'Malvaceae',
      waterNeed: 12,
      growthStages: ['Emergence', 'Squaring', 'Flowering', 'Boll Development', 'Boll Opening', 'Harvest'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Black Cotton Soil', 'Alluvial Loam', 'Red Loam'],
      irrigationMethods: ['Drip', 'Furrow', 'Sprinkler'],
      season: 'Kharif',
      daysToMaturity: 170,
      yieldPerHa: '2–3 tonnes (lint)',
      cropIcon: 'local_florist'
    },
    'Sugarcane': {
      scientificName: 'Saccharum officinarum',
      defaultVariety: 'Co 0238',
      family: 'Poaceae',
      waterNeed: 20,
      growthStages: ['Germination', 'Tillering', 'Grand Growth', 'Maturity', 'Harvest'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Alluvial Loam', 'Clay Loam', 'Red Loam'],
      irrigationMethods: ['Drip', 'Furrow', 'Flood'],
      season: 'Annual (12–18 months)',
      daysToMaturity: 365,
      yieldPerHa: '70–100 tonnes',
      cropIcon: 'park'
    },
    'Maize': {
      scientificName: 'Zea mays',
      defaultVariety: 'DHM-121 (Hybrid)',
      family: 'Poaceae',
      waterNeed: 9,
      growthStages: ['Emergence', 'Vegetative (V6–VT)', 'Tasseling', 'Silking', 'Grain Fill', 'Maturity'],
      optimalSoilPH: '5.8–7.0',
      idealSoilTypes: ['Alluvial Loam', 'Sandy Loam', 'Red Loam'],
      irrigationMethods: ['Sprinkler', 'Drip', 'Furrow'],
      season: 'Kharif / Rabi',
      daysToMaturity: 100,
      yieldPerHa: '6–8 tonnes',
      cropIcon: 'eco'
    },
    'Soybean': {
      scientificName: 'Glycine max',
      defaultVariety: 'JS 9560',
      family: 'Fabaceae',
      waterNeed: 7,
      growthStages: ['Emergence', 'Vegetative', 'Flowering (R1-R2)', 'Pod Development (R3-R4)', 'Seed Fill (R5-R6)', 'Maturity'],
      optimalSoilPH: '6.0–6.8',
      idealSoilTypes: ['Black Cotton Soil', 'Alluvial Loam', 'Red Loam'],
      irrigationMethods: ['Sprinkler', 'Furrow', 'Drip'],
      season: 'Kharif',
      daysToMaturity: 100,
      yieldPerHa: '2–3 tonnes',
      cropIcon: 'spa'
    },
    'Groundnut': {
      scientificName: 'Arachis hypogaea',
      defaultVariety: 'TAG 24',
      family: 'Fabaceae',
      waterNeed: 8,
      growthStages: ['Emergence', 'Vegetative', 'Flowering', 'Pegging', 'Pod Development', 'Maturity'],
      optimalSoilPH: '6.0–6.5',
      idealSoilTypes: ['Sandy Loam', 'Red Sandy Loam', 'Alluvial Loam'],
      irrigationMethods: ['Sprinkler', 'Drip', 'Furrow'],
      season: 'Kharif / Rabi',
      daysToMaturity: 120,
      yieldPerHa: '1.5–2.5 tonnes',
      cropIcon: 'nutrition'
    },
    'Mustard': {
      scientificName: 'Brassica juncea',
      defaultVariety: 'Pusa Bold',
      family: 'Brassicaceae',
      waterNeed: 5,
      growthStages: ['Germination', 'Rosette', 'Bolting', 'Flowering', 'Siliqua Formation', 'Maturity'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Clay Loam'],
      irrigationMethods: ['Sprinkler', 'Flood', 'Drip'],
      season: 'Rabi',
      daysToMaturity: 110,
      yieldPerHa: '1.5–2 tonnes',
      cropIcon: 'local_florist'
    },
    'Onion': {
      scientificName: 'Allium cepa',
      defaultVariety: 'Agrifound Dark Red',
      family: 'Amaryllidaceae',
      waterNeed: 7,
      growthStages: ['Transplanting', 'Vegetative', 'Bulb Initiation', 'Bulb Development', 'Maturity', 'Harvest'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Red Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: 'Rabi / Late Kharif',
      daysToMaturity: 130,
      yieldPerHa: '20–30 tonnes',
      cropIcon: 'nutrition'
    },
    'Potato': {
      scientificName: 'Solanum tuberosum',
      defaultVariety: 'Kufri Jyoti',
      family: 'Solanaceae',
      waterNeed: 9,
      growthStages: ['Sprouting', 'Vegetative', 'Tuber Initiation', 'Tuber Bulking', 'Maturity'],
      optimalSoilPH: '5.5–6.5',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Silt Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: 'Rabi',
      daysToMaturity: 100,
      yieldPerHa: '25–35 tonnes',
      cropIcon: 'nutrition'
    },
    'Chilli': {
      scientificName: 'Capsicum annuum',
      defaultVariety: 'Pusa Jwala',
      family: 'Solanaceae',
      waterNeed: 8,
      growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruit Set', 'Ripening', 'Harvest'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Red Sandy Loam', 'Black Cotton Soil'],
      irrigationMethods: ['Drip', 'Furrow', 'Sprinkler'],
      season: 'Kharif / Rabi',
      daysToMaturity: 120,
      yieldPerHa: '8–12 tonnes (green)',
      cropIcon: 'local_fire_department'
    },
    'Turmeric': {
      scientificName: 'Curcuma longa',
      defaultVariety: 'Erode Local',
      family: 'Zingiberaceae',
      waterNeed: 11,
      growthStages: ['Sprouting', 'Vegetative', 'Active Growth', 'Rhizome Formation', 'Maturity'],
      optimalSoilPH: '5.5–7.0',
      idealSoilTypes: ['Sandy Loam', 'Clay Loam', 'Red Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: 'Kharif (7–9 months)',
      daysToMaturity: 240,
      yieldPerHa: '20–25 tonnes (fresh)',
      cropIcon: 'spa'
    },
    'Banana': {
      scientificName: 'Musa spp.',
      defaultVariety: 'Grand Naine (Cavendish)',
      family: 'Musaceae',
      waterNeed: 16,
      growthStages: ['Sucker Planting', 'Vegetative', 'Flowering', 'Bunch Development', 'Harvest'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Alluvial Loam', 'Sandy Loam', 'Clay Loam'],
      irrigationMethods: ['Drip', 'Micro-sprinkler', 'Basin'],
      season: 'Annual (10–14 months)',
      daysToMaturity: 365,
      yieldPerHa: '40–60 tonnes',
      cropIcon: 'nutrition'
    },
    'Mango': {
      scientificName: 'Mangifera indica',
      defaultVariety: 'Alphonso / Dasheri',
      family: 'Anacardiaceae',
      waterNeed: 6,
      growthStages: ['Dormancy', 'Bud Break', 'Flowering', 'Fruit Set', 'Fruit Development', 'Harvest'],
      optimalSoilPH: '5.5–7.0',
      idealSoilTypes: ['Alluvial Loam', 'Red Laterite', 'Sandy Loam'],
      irrigationMethods: ['Drip', 'Basin', 'Micro-sprinkler'],
      season: 'Perennial (March–June harvest)',
      daysToMaturity: 120,
      yieldPerHa: '8–15 tonnes',
      cropIcon: 'nutrition'
    },
    'Tea': {
      scientificName: 'Camellia sinensis',
      defaultVariety: 'TV-1 (Tocklai)',
      family: 'Theaceae',
      waterNeed: 14,
      growthStages: ['Pruning Recovery', 'Flush Growth', 'Active Plucking', 'Maintenance'],
      optimalSoilPH: '4.5–5.5',
      idealSoilTypes: ['Laterite', 'Red Loam', 'Acidic Clay'],
      irrigationMethods: ['Sprinkler', 'Drip', 'Rain-fed'],
      season: 'Perennial (year-round)',
      daysToMaturity: 365,
      yieldPerHa: '2–3 tonnes (made tea)',
      cropIcon: 'eco'
    },
    'Coffee': {
      scientificName: 'Coffea arabica / C. canephora',
      defaultVariety: 'S.795 (Arabica) / CxR (Robusta)',
      family: 'Rubiaceae',
      waterNeed: 12,
      growthStages: ['Blossom', 'Pinhead', 'Berry Expansion', 'Endosperm Growth', 'Ripening', 'Harvest'],
      optimalSoilPH: '5.0–6.5',
      idealSoilTypes: ['Red Laterite', 'Forest Loam', 'Sandy Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Rain-fed'],
      season: 'Perennial (Nov–Feb harvest)',
      daysToMaturity: 270,
      yieldPerHa: '1–2 tonnes (clean coffee)',
      cropIcon: 'local_cafe'
    },
    'Coconut': {
      scientificName: 'Cocos nucifera',
      defaultVariety: 'West Coast Tall (WCT)',
      family: 'Arecaceae',
      waterNeed: 10,
      growthStages: ['Seedling', 'Juvenile (non-bearing)', 'Early Bearing', 'Full Bearing', 'Senescent'],
      optimalSoilPH: '5.5–7.0',
      idealSoilTypes: ['Sandy Loam', 'Laterite', 'Alluvial Loam'],
      irrigationMethods: ['Drip', 'Basin', 'Micro-sprinkler'],
      season: 'Perennial (year-round)',
      daysToMaturity: 365,
      yieldPerHa: '80–120 nuts/palm/yr',
      cropIcon: 'park'
    },
    'Jute': {
      scientificName: 'Corchorus capsularis',
      defaultVariety: 'JRC 321',
      family: 'Malvaceae',
      waterNeed: 14,
      growthStages: ['Germination', 'Vegetative', 'Fibre Development', 'Maturity', 'Retting'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Alluvial Loam', 'Clay Loam', 'Sandy Loam'],
      irrigationMethods: ['Flood', 'Rain-fed', 'Furrow'],
      season: 'Kharif',
      daysToMaturity: 120,
      yieldPerHa: '2–3 tonnes (fibre)',
      cropIcon: 'grass'
    },
    'Chickpea': {
      scientificName: 'Cicer arietinum',
      defaultVariety: 'Pusa 256',
      family: 'Fabaceae',
      waterNeed: 5,
      growthStages: ['Germination', 'Vegetative', 'Flowering', 'Pod Development', 'Maturity'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Sandy Loam', 'Clay Loam', 'Black Cotton Soil'],
      irrigationMethods: ['Sprinkler', 'Drip', 'Rain-fed'],
      season: 'Rabi',
      daysToMaturity: 110,
      yieldPerHa: '1.5–2 tonnes',
      cropIcon: 'spa'
    },
    'Pigeon Pea': {
      scientificName: 'Cajanus cajan',
      defaultVariety: 'Asha (ICPL 87119)',
      family: 'Fabaceae',
      waterNeed: 6,
      growthStages: ['Emergence', 'Vegetative', 'Flowering', 'Pod Development', 'Maturity'],
      optimalSoilPH: '5.5–7.0',
      idealSoilTypes: ['Red Loam', 'Black Cotton Soil', 'Sandy Loam'],
      irrigationMethods: ['Rain-fed', 'Sprinkler', 'Drip'],
      season: 'Kharif',
      daysToMaturity: 160,
      yieldPerHa: '1–1.5 tonnes',
      cropIcon: 'spa'
    },
    'Lentil': {
      scientificName: 'Lens culinaris',
      defaultVariety: 'Pant L-7',
      family: 'Fabaceae',
      waterNeed: 4,
      growthStages: ['Germination', 'Vegetative', 'Flowering', 'Pod Fill', 'Maturity'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Sandy Loam', 'Clay Loam', 'Alluvial Loam'],
      irrigationMethods: ['Sprinkler', 'Rain-fed', 'Drip'],
      season: 'Rabi',
      daysToMaturity: 110,
      yieldPerHa: '1–1.5 tonnes',
      cropIcon: 'spa'
    },
    'Cucumber': {
      scientificName: 'Cucumis sativus',
      defaultVariety: 'Pusa Uday',
      family: 'Cucurbitaceae',
      waterNeed: 9,
      growthStages: ['Germination', 'Vine Growth', 'Flowering', 'Fruit Set', 'Harvest'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Silt Loam'],
      irrigationMethods: ['Drip', 'Furrow', 'Sprinkler'],
      season: 'Kharif / Summer',
      daysToMaturity: 60,
      yieldPerHa: '15–25 tonnes',
      cropIcon: 'nutrition'
    },
    'Brinjal': {
      scientificName: 'Solanum melongena',
      defaultVariety: 'Pusa Purple Long',
      family: 'Solanaceae',
      waterNeed: 9,
      growthStages: ['Seedling', 'Vegetative', 'Flowering', 'Fruit Set', 'Harvest'],
      optimalSoilPH: '5.5–6.5',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Red Loam'],
      irrigationMethods: ['Drip', 'Furrow', 'Sprinkler'],
      season: 'Kharif / Rabi',
      daysToMaturity: 80,
      yieldPerHa: '25–40 tonnes',
      cropIcon: 'nutrition'
    },
    'Cabbage': {
      scientificName: 'Brassica oleracea var. capitata',
      defaultVariety: 'Golden Acre',
      family: 'Brassicaceae',
      waterNeed: 8,
      growthStages: ['Seedling', 'Vegetative', 'Head Formation', 'Head Maturity', 'Harvest'],
      optimalSoilPH: '6.0–6.8',
      idealSoilTypes: ['Sandy Loam', 'Silt Loam', 'Clay Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: 'Rabi',
      daysToMaturity: 90,
      yieldPerHa: '30–45 tonnes',
      cropIcon: 'nutrition'
    },
    'Cauliflower': {
      scientificName: 'Brassica oleracea var. botrytis',
      defaultVariety: 'Pusa Snowball K-1',
      family: 'Brassicaceae',
      waterNeed: 8,
      growthStages: ['Seedling', 'Vegetative', 'Curd Initiation', 'Curd Development', 'Harvest'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Silt Loam', 'Clay Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: 'Rabi',
      daysToMaturity: 95,
      yieldPerHa: '20–35 tonnes',
      cropIcon: 'nutrition'
    },
    'Okra': {
      scientificName: 'Abelmoschus esculentus',
      defaultVariety: 'Arka Anamika',
      family: 'Malvaceae',
      waterNeed: 7,
      growthStages: ['Germination', 'Vegetative', 'Flowering', 'Pod Development', 'Harvest'],
      optimalSoilPH: '6.0–6.8',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Clay Loam'],
      irrigationMethods: ['Drip', 'Furrow', 'Sprinkler'],
      season: 'Kharif / Summer',
      daysToMaturity: 60,
      yieldPerHa: '10–15 tonnes',
      cropIcon: 'nutrition'
    },
    'Garlic': {
      scientificName: 'Allium sativum',
      defaultVariety: 'Yamuna Safed (G-1)',
      family: 'Amaryllidaceae',
      waterNeed: 6,
      growthStages: ['Sprouting', 'Vegetative', 'Bulb Initiation', 'Bulb Development', 'Maturity'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Silt Loam', 'Alluvial Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: 'Rabi',
      daysToMaturity: 140,
      yieldPerHa: '8–12 tonnes',
      cropIcon: 'nutrition'
    },
    'Sunflower': {
      scientificName: 'Helianthus annuus',
      defaultVariety: 'KBSH-44',
      family: 'Asteraceae',
      waterNeed: 7,
      growthStages: ['Emergence', 'Vegetative', 'Bud Stage', 'Flowering', 'Seed Fill', 'Maturity'],
      optimalSoilPH: '6.0–7.5',
      idealSoilTypes: ['Black Cotton Soil', 'Alluvial Loam', 'Red Loam'],
      irrigationMethods: ['Furrow', 'Sprinkler', 'Drip'],
      season: 'Kharif / Rabi',
      daysToMaturity: 100,
      yieldPerHa: '1.5–2 tonnes',
      cropIcon: 'local_florist'
    },
    'Cardamom': {
      scientificName: 'Elettaria cardamomum',
      defaultVariety: 'Mysore (Green)',
      family: 'Zingiberaceae',
      waterNeed: 14,
      growthStages: ['Vegetative', 'Panicle Emergence', 'Flowering', 'Capsule Development', 'Harvest'],
      optimalSoilPH: '5.0–6.5',
      idealSoilTypes: ['Forest Loam', 'Red Laterite', 'Clay Loam'],
      irrigationMethods: ['Sprinkler', 'Drip', 'Rain-fed'],
      season: 'Perennial (Aug–Feb harvest)',
      daysToMaturity: 365,
      yieldPerHa: '150–250 kg (dry)',
      cropIcon: 'spa'
    },
    'Custom / Other': {
      scientificName: '—',
      defaultVariety: '—',
      family: '—',
      waterNeed: 10,
      growthStages: ['Vegetative', 'Reproductive', 'Maturity', 'Harvest'],
      optimalSoilPH: '6.0–7.0',
      idealSoilTypes: ['Sandy Loam', 'Alluvial Loam', 'Clay Loam'],
      irrigationMethods: ['Drip', 'Sprinkler', 'Furrow'],
      season: '—',
      daysToMaturity: 120,
      yieldPerHa: '—',
      cropIcon: 'agriculture'
    }
  };

  // Common Indian soil types
  const SOIL_TYPES = [
    'Red Sandy Loam',
    'Alluvial Loam',
    'Black Cotton Soil',
    'Clay Loam',
    'Sandy Loam',
    'Laterite',
    'Red Loam',
    'Silt Loam',
    'Forest Loam',
    'Acidic Clay'
  ];

  // Common irrigation methods
  const IRRIGATION_METHODS = [
    'Drip (Inline PC)',
    'Drip (1.6 L/h)',
    'Flood (Paddy)',
    'Furrow',
    'Sprinkler',
    'Micro-sprinkler',
    'Basin',
    'AWD (Alternate Wetting & Drying)',
    'Rain-fed',
    'SRI Method'
  ];

  // Normalize and validate Indian mobile numbers
  function sanitizePhone(raw) {
    if (!raw) return '';
    let cleaned = raw.trim().replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.slice(3);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    return cleaned;
  }

  function validate(name, phone) {
    const trimmedName = (name || '').trim();
    if (!trimmedName || trimmedName.length < 2) {
      return { valid: false, message: 'Please enter your name.' };
    }

    const cleanedPhone = sanitizePhone(phone);
    // Valid Indian mobile: 10 digits, typically starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      return { valid: false, message: 'Please enter a valid 10-digit phone number.' };
    }

    return { valid: true, name: trimmedName, phone: cleanedPhone };
  }

  function getInitials(name) {
    if (!name) return 'AT';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Storage read error', e);
      return null;
    }
  }

  function setCurrentUser(user) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      // Also register in users table
      const users = getAllUsers();
      users[user.phone] = user;
      localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }

  function getAllUsers() {
    try {
      const data = localStorage.getItem(USERS_STORE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.warn('Storage remove error', e);
    }
  }

  // Get or initialize user-specific farm data (strict data isolation)
  function getUserFarm(userId) {
    try {
      const key = FARMS_STORE_PREFIX + userId;
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);

      // Default baseline farm personalized to user
      const defaultFarm = buildFarmFromCrop('Tomato', {
        userId: userId,
        name: 'My Farm',
        location: 'Coimbatore, Tamil Nadu',
        area: 2.5,
        soilType: 'Red Sandy Loam',
        irrigationMethod: 'Drip (1.6 L/h)',
        waterSource: 'Borewell & Farm Pond'
      });

      localStorage.setItem(key, JSON.stringify(defaultFarm));
      return defaultFarm;
    } catch (e) {
      console.warn('Error reading farm data', e);
      return null;
    }
  }

  // Build a complete farm object from a crop name + user overrides
  function buildFarmFromCrop(cropName, overrides) {
    const crop = CROP_DATABASE[cropName] || CROP_DATABASE['Custom / Other'];
    const userId = (overrides && overrides.userId) || 'unknown';
    const area = (overrides && overrides.area) || 2.5;
    const location = (overrides && overrides.location) || 'Coimbatore, Tamil Nadu';
    const soilType = (overrides && overrides.soilType) || crop.idealSoilTypes[0];
    const irrigationMethod = (overrides && overrides.irrigationMethod) || crop.irrigationMethods[0];

    // Randomize starting growth stage (pick mid-stage for realism)
    const stageIndex = Math.min(2, crop.growthStages.length - 1);

    // Generate plausible agronomic baselines based on crop
    const baselineMoisture = Math.round(50 + crop.waterNeed * 1.2);
    const baselineChlorophyll = +(38 + Math.random() * 12).toFixed(1);
    const baselineSustainability = Math.round(72 + Math.random() * 12);
    const baselineCropHealth = Math.round(80 + Math.random() * 12);
    const baselineWaterEfficiency = Math.round(75 + Math.random() * 12);

    // Compute cost per cycle based on area and water need
    const baseCostPerHa = crop.waterNeed * 500;  // ₹500 per L/m²/ha basis
    const baseCost = Math.round(baseCostPerHa * area);

    return {
      id: 'farm_' + userId,
      userId: userId,
      name: (overrides && overrides.name) || 'My Farm',
      location: location,
      coordinates: '',
      area: area,
      parcel: cropName + ' Parcel',
      primaryCrop: cropName + (crop.scientificName !== '—' ? ' (' + crop.scientificName + ')' : ''),
      cropName: cropName,
      cropVariety: (overrides && overrides.cropVariety) || crop.defaultVariety,
      growthStage: crop.growthStages[stageIndex],
      growthStages: crop.growthStages,
      plantingDate: new Date().toISOString().split('T')[0],
      soilType: soilType,
      irrigationMethod: irrigationMethod,
      waterSource: (overrides && overrides.waterSource) || 'Borewell & Farm Pond',
      soilMoisture: baselineMoisture,
      chlorophyll: baselineChlorophyll,
      sustainabilityScore: baselineSustainability,
      cropHealthPercent: baselineCropHealth,
      waterEfficiencyPercent: baselineWaterEfficiency,
      weatherRisk: 'Low (18% rain prob)',
      waterNeedBaseline: crop.waterNeed,
      baseCostPerCycle: baseCost,
      optimalSoilPH: crop.optimalSoilPH,
      season: crop.season,
      daysToMaturity: crop.daysToMaturity,
      yieldPerHa: crop.yieldPerHa,
      cropFamily: crop.family,
      history: overrides && overrides.history ? overrides.history : [
        { date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), action: 'Farm profile created for ' + cropName, impact: 'Baseline established', score: baselineSustainability }
      ],
      simulations: []
    };
  }

  // Update the farm profile (crop, location, area, etc.)
  function updateFarmProfile(userId, updates) {
    const farm = getUserFarm(userId);
    if (!farm) return null;

    const cropChanged = updates.cropName && updates.cropName !== farm.cropName;

    if (cropChanged) {
      // Rebuild agronomic params from new crop, keep history
      const newFarm = buildFarmFromCrop(updates.cropName, {
        userId: userId,
        name: updates.farmName || farm.name,
        location: updates.location || farm.location,
        area: updates.area || farm.area,
        soilType: updates.soilType || undefined,
        irrigationMethod: updates.irrigationMethod || undefined,
        waterSource: updates.waterSource || farm.waterSource,
        cropVariety: updates.cropVariety || undefined,
        history: farm.history
      });

      // Add history entry for crop change
      newFarm.history.unshift({
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        action: 'Changed crop to ' + updates.cropName,
        impact: 'All agronomic baselines recalculated',
        score: newFarm.sustainabilityScore
      });

      saveUserFarm(userId, newFarm);
      return newFarm;
    } else {
      // Update non-crop fields
      if (updates.farmName) farm.name = updates.farmName;
      if (updates.location) farm.location = updates.location;
      if (updates.area) {
        farm.area = parseFloat(updates.area);
        farm.baseCostPerCycle = Math.round(farm.waterNeedBaseline * 500 * farm.area);
      }
      if (updates.soilType) farm.soilType = updates.soilType;
      if (updates.irrigationMethod) farm.irrigationMethod = updates.irrigationMethod;
      if (updates.waterSource) farm.waterSource = updates.waterSource;
      if (updates.cropVariety) farm.cropVariety = updates.cropVariety;
      if (updates.growthStage) farm.growthStage = updates.growthStage;

      // Add history entry
      farm.history.unshift({
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        action: 'Updated farm profile',
        impact: 'Configuration refreshed',
        score: farm.sustainabilityScore
      });

      saveUserFarm(userId, farm);
      return farm;
    }
  }

  function saveUserFarm(userId, farmData) {
    try {
      const key = FARMS_STORE_PREFIX + userId;
      localStorage.setItem(key, JSON.stringify(farmData));
    } catch (e) {
      console.warn('Error saving farm data', e);
    }
  }

  // Reset farm to defaults (for re-setup)
  function resetUserFarm(userId) {
    try {
      const key = FARMS_STORE_PREFIX + userId;
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Error resetting farm', e);
    }
  }

  // Crop-aware simulation calculations
  function calculateSimulation(irrigationLiters, farm) {
    // Use farm's crop-specific baseline if available
    const baseline = (farm && farm.waterNeedBaseline) ? farm.waterNeedBaseline : 10;
    const area = (farm && farm.area) ? farm.area : 2.5;
    const baseCost = (farm && farm.baseCostPerCycle) ? farm.baseCostPerCycle : 5000;

    const liters = Math.max(Math.floor(baseline * 0.4), Math.min(Math.ceil(baseline * 2.5), parseFloat(irrigationLiters) || baseline));
    const waterUsePercent = Math.round((liters / baseline) * 100);

    // Yield curve: peaks near baseline * 1.2, drops if under or over-irrigated
    const optimal = baseline * 1.2;
    let yieldPercent = 100;
    if (liters <= baseline) {
      yieldPercent = Math.round(100 - (baseline - liters) * (35 / baseline));
    } else if (liters <= optimal) {
      yieldPercent = Math.round(100 + (liters - baseline) * (15 / (optimal - baseline)));
    } else {
      yieldPercent = Math.round(103 - (liters - optimal) * (18 / baseline));
    }
    yieldPercent = Math.max(50, Math.min(115, yieldPercent));

    // Cost calculation proportional to area and water delta
    const costPerLiterDelta = Math.round(baseCost * 0.012);
    const cost = Math.round(baseCost + (liters - baseline) * costPerLiterDelta);
    const costDelta = cost - baseCost;

    // Sustainability score (0-100)
    let score = (farm && farm.sustainabilityScore) ? farm.sustainabilityScore : 78;
    const baseScore = score;

    if (liters === baseline) {
      // no change
    } else if (liters < baseline) {
      score = Math.max(50, score - (baseline - liters) * 2.5);
    } else if (liters <= optimal) {
      score = Math.min(95, score + (liters - baseline) * 1.5);
    } else {
      score = Math.max(45, score - (liters - optimal) * 3.2);
    }
    score = Math.min(100, Math.max(0, Math.round(score)));

    // Soil moisture & risk status
    const anticipatedMoisture = Math.round(48 + liters * 1.85);
    let riskLabel = 'Low Stress';
    let riskColor = '#16A34A';
    let riskBg = '#DCFCE7';

    if (anticipatedMoisture > 72) {
      riskLabel = 'Slight Waterlogging Risk';
      riskColor = '#D97706';
      riskBg = '#FEF3C7';
    } else if (anticipatedMoisture < 55) {
      riskLabel = 'Moisture Deficit Warning';
      riskColor = '#DC2626';
      riskBg = '#FEE2E2';
    }

    if (anticipatedMoisture > 85) {
      riskLabel = 'Severe Waterlogging';
      riskColor = '#DC2626';
      riskBg = '#FEE2E2';
    }

    return {
      liters,
      baseline,
      waterUsePercent,
      yieldPercent,
      cost,
      baseCost,
      costDelta,
      score,
      scoreDelta: score - baseScore,
      anticipatedMoisture,
      riskLabel,
      riskColor,
      riskBg
    };
  }

  // Get list of all available crop names
  function getCropNames() {
    return Object.keys(CROP_DATABASE);
  }

  // Get crop details by name
  function getCropDetails(name) {
    return CROP_DATABASE[name] || null;
  }

  return {
    sanitizePhone,
    validate,
    getInitials,
    getCurrentUser,
    setCurrentUser,
    clearSession,
    getUserFarm,
    saveUserFarm,
    resetUserFarm,
    updateFarmProfile,
    buildFarmFromCrop,
    calculateSimulation,
    getCropNames,
    getCropDetails,
    CROP_DATABASE,
    SOIL_TYPES,
    IRRIGATION_METHODS
  };
})();

if (typeof window !== 'undefined') {
  window.AgroTwinState = AgroTwinState;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgroTwinState;
}
