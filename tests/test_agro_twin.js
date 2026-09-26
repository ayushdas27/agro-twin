/**
 * Automated test suite for AGRO-TWIN onboarding, validation,
 * profile management, session persistence, user data isolation,
 * and What-If simulation engine.
 */

const assert = require('assert');

// Mock localStorage for Node.js test environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => (key in mockStorage ? mockStorage[key] : null),
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Load the module
const AgroTwinState = require('../js/agroTwinState.js');

console.log('====================================================');
console.log('RUNNING AGRO-TWIN MVP TEST SUITE');
console.log('====================================================\n');

// 1. Phone Sanitization & Validation Tests
console.log('TEST 1: Input Validation & Sanitization');
{
  const v1 = AgroTwinState.validate('', '9876543210');
  assert.strictEqual(v1.valid, false, 'Empty name should fail');
  assert.strictEqual(v1.message, 'Please enter your name.');

  const v2 = AgroTwinState.validate('A', '9876543210');
  assert.strictEqual(v2.valid, false, 'Single char name should fail');
  assert.strictEqual(v2.message, 'Please enter your name.');

  const v3 = AgroTwinState.validate('Rahul Sharma', '12345');
  assert.strictEqual(v3.valid, false, 'Short phone should fail');
  assert.strictEqual(v3.message, 'Please enter a valid 10-digit phone number.');

  const v4 = AgroTwinState.validate('Rahul Sharma', 'abc');
  assert.strictEqual(v4.valid, false, 'Non-digit phone should fail');

  const v5 = AgroTwinState.validate('Rahul Sharma', '9876543210');
  assert.strictEqual(v5.valid, true, 'Valid name and 10-digit Indian phone should pass');
  assert.strictEqual(v5.name, 'Rahul Sharma');
  assert.strictEqual(v5.phone, '9876543210');

  const v6 = AgroTwinState.validate('Priya Das', '+91 9123456780');
  assert.strictEqual(v6.valid, true, '+91 prefix should be accepted');
  assert.strictEqual(v6.phone, '9123456780');

  const v7 = AgroTwinState.validate('Priya Das', '+91-9123456780');
  assert.strictEqual(v7.valid, true, '+91- prefix should be accepted');
  assert.strictEqual(v7.phone, '9123456780');

  console.log('  [PASS] All validation cases passed.');
}

// 2. Profile Generation & Dynamic Initials
console.log('\nTEST 2: Dynamic Name & Profile Generation');
{
  const in1 = AgroTwinState.getInitials('Rahul Sharma');
  assert.strictEqual(in1, 'RS', 'Rahul Sharma initials should be RS');

  const in2 = AgroTwinState.getInitials('Priya Das');
  assert.strictEqual(in2, 'PD', 'Priya Das initials should be PD');

  const in3 = AgroTwinState.getInitials('Kavitha');
  assert.strictEqual(in3, 'KA', 'Single name should use first two chars');

  console.log('  [PASS] Profile initials generated correctly.');
}

// 3. User Session Persistence & Refresh
console.log('\nTEST 3: User Session Persistence (Refresh Simulation)');
{
  global.localStorage.clear();

  const userRahul = {
    userId: 'usr_9876543210',
    name: 'Rahul Sharma',
    firstName: 'Rahul',
    phone: '9876543210',
    initials: 'RS',
    isReturning: true
  };

  AgroTwinState.setCurrentUser(userRahul);

  // Simulate page reload
  const restoredUser = AgroTwinState.getCurrentUser();
  assert.notStrictEqual(restoredUser, null, 'User session should persist');
  assert.strictEqual(restoredUser.name, 'Rahul Sharma');
  assert.strictEqual(restoredUser.firstName, 'Rahul');
  assert.strictEqual(restoredUser.phone, '9876543210');

  console.log('  [PASS] Session persistence verified across reloads.');
}

// 4. Sign Out
console.log('\nTEST 4: Sign Out (Session Termination)');
{
  AgroTwinState.clearSession();
  const sessionAfterSignOut = AgroTwinState.getCurrentUser();
  assert.strictEqual(sessionAfterSignOut, null, 'Session should be null after sign out');
  console.log('  [PASS] Sign out successfully clears session.');
}

// 5. User Data Isolation
console.log('\nTEST 5: Strict User Data Isolation (User A vs User B)');
{
  global.localStorage.clear();

  // User A: Rahul
  const farmA = AgroTwinState.getUserFarm('usr_9876543210');
  farmA.name = "Rahul's Delta Farm";
  farmA.area = 3.5;
  AgroTwinState.saveUserFarm('usr_9876543210', farmA);

  // User B: Priya
  const farmB = AgroTwinState.getUserFarm('usr_9123456780');
  farmB.name = "Priya's Organic Oasis";
  farmB.area = 1.8;
  AgroTwinState.saveUserFarm('usr_9123456780', farmB);

  // Verify User A still has their own farm
  const checkFarmA = AgroTwinState.getUserFarm('usr_9876543210');
  assert.strictEqual(checkFarmA.name, "Rahul's Delta Farm");
  assert.strictEqual(checkFarmA.area, 3.5);

  // Verify User B still has their own farm
  const checkFarmB = AgroTwinState.getUserFarm('usr_9123456780');
  assert.strictEqual(checkFarmB.name, "Priya's Organic Oasis");
  assert.strictEqual(checkFarmB.area, 1.8);

  // Confirm User A cannot see User B's farm
  assert.notStrictEqual(checkFarmA.name, checkFarmB.name);
  console.log('  [PASS] Data isolation verified between users.');
}

// 6. What-If Simulation Engine
console.log('\nTEST 6: What-If Simulation Engine Calculations');
{
  // Baseline (10 L/m²)
  const sim10 = AgroTwinState.calculateSimulation(10);
  assert.strictEqual(sim10.waterUsePercent, 100);
  assert.strictEqual(sim10.yieldPercent, 100);
  assert.strictEqual(sim10.cost, 5000);
  assert.strictEqual(sim10.score, 78);

  // Simulated (14 L/m²)
  const sim14 = AgroTwinState.calculateSimulation(14);
  assert.strictEqual(sim14.waterUsePercent, 140);
  assert.strictEqual(sim14.cost, 5230);
  assert.strictEqual(sim14.score, 74);
  assert.strictEqual(sim14.riskLabel, 'Slight Waterlogging Risk');

  // Optimal Scenario (12 L/m²)
  const sim12 = AgroTwinState.calculateSimulation(12);
  assert.strictEqual(sim12.waterUsePercent, 120);
  assert.strictEqual(sim12.yieldPercent, 103);
  assert.strictEqual(sim12.score, 81); // Gain +3 pts

  console.log('  [PASS] Simulation engine calculations match specification.');
}

console.log('\n====================================================');
console.log('ALL TESTS PASSED SUCCESSFULLY! (6/6)');
console.log('====================================================');
