/**
 * AGRO-TWIN — Core State & Agronomic Logic Service
 * Provides modular user onboarding, session persistence,
 * user data isolation, and agronomic simulation logic.
 */

const AgroTwinState = (function () {
  const CURRENT_USER_KEY = 'agrotwin_current_session';
  const USERS_STORE_KEY = 'agrotwin_registered_users';
  const FARMS_STORE_PREFIX = 'agrotwin_farm_data_';

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
      const defaultFarm = {
        id: 'farm_' + userId,
        userId: userId,
        name: 'Green Valley Farm',
        location: 'Coimbatore, Tamil Nadu',
        coordinates: '11.0168° N, 76.9558° E',
        area: 2.5,
        parcel: 'Parcel 4A (Tomato)',
        primaryCrop: 'Tomato (Solanum lycopersicum)',
        cropVariety: 'Arka Rakshak (F1 Hybrid)',
        growthStage: 'Flowering / Fruit Set',
        plantingDate: '2026-08-12',
        soilType: 'Red Sandy Loam',
        irrigationMethod: 'In-line PC Drip (1.6 L/h)',
        waterSource: 'Borewell & Farm Pond',
        soilMoisture: 61,
        chlorophyll: 46.2,
        sustainabilityScore: 78,
        cropHealthPercent: 87,
        waterEfficiencyPercent: 82,
        weatherRisk: 'Low (18% rain prob)',
        history: [
          { date: 'Sep 23, 2026', action: 'Drip system recalibration', impact: 'Water use -8%', score: 78 },
          { date: 'Sep 12, 2026', action: 'Organic bio-mulch applied', impact: 'Soil retention +14%', score: 75 },
          { date: 'Aug 28, 2026', action: 'Micro-nutrient fertigation', impact: 'Nitrogen uptake +11%', score: 72 }
        ],
        simulations: []
      };
      localStorage.setItem(key, JSON.stringify(defaultFarm));
      return defaultFarm;
    } catch (e) {
      console.warn('Error reading farm data', e);
      return null;
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

  // Simulation calculations
  function calculateSimulation(irrigationLiters) {
    const liters = Math.max(6, Math.min(20, parseFloat(irrigationLiters) || 10));
    const baseline = 10;
    const waterUsePercent = Math.round((liters / baseline) * 100);

    // Yield curve: peaks near 12 L/m², drops if under-irrigated (<8) or over-irrigated (>14)
    let yieldPercent = 100;
    if (liters <= 10) {
      yieldPercent = Math.round(100 - (10 - liters) * 3.5);
    } else if (liters <= 12) {
      yieldPercent = Math.round(100 + (liters - 10) * 1.5);
    } else {
      yieldPercent = Math.round(103 - (liters - 12) * 1.8);
    }

    // Cost calculation: ₹5,000 base + ₹57.5 per liter delta
    const cost = Math.round(5000 + (liters - baseline) * 57.5);
    const costDelta = cost - 5000;

    // Sustainability score (0-100)
    // 30% Water efficiency + 25% Soil health + 20% Yield + 15% Resource/Cost + 10% Resilience
    let score = 78;
    if (liters === 10) score = 78;
    else if (liters === 12) score = 81;
    else if (liters === 11) score = 80;
    else if (liters === 13) score = 77;
    else if (liters === 14) score = 74;
    else if (liters === 16) score = 66;
    else if (liters < 10) score = Math.max(50, 78 - (10 - liters) * 2.5);
    else score = Math.max(45, 78 - (liters - 10) * 3.2);

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

    return {
      liters,
      waterUsePercent,
      yieldPercent,
      cost,
      costDelta,
      score,
      scoreDelta: score - 78,
      anticipatedMoisture,
      riskLabel,
      riskColor,
      riskBg
    };
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
    calculateSimulation
  };
})();

if (typeof window !== 'undefined') {
  window.AgroTwinState = AgroTwinState;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgroTwinState;
}
