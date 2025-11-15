// Test script to verify score calculation logic
import { calculateUXScore } from './src/services/scoreCalculator.js';

console.log('=== Testing UX Score Calculation ===\n');

// Test 1: No issues
const test1 = [];
const score1 = calculateUXScore(test1);
console.log(`Test 1 - No issues:`);
console.log(`  Expected: 100`);
console.log(`  Got: ${score1}`);
console.log(`  ✓ ${score1 === 100 ? 'PASS' : 'FAIL'}\n`);

// Test 2: 5 critical + 1 medium (like your current result)
const test2 = [
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'medium' }
];
const score2 = calculateUXScore(test2);
console.log(`Test 2 - 5 critical + 1 medium:`);
console.log(`  Calculation: 100 - (5 × 15) - (1 × 8) = 100 - 75 - 8 = 17`);
console.log(`  Expected: 17`);
console.log(`  Got: ${score2}`);
console.log(`  ✓ ${score2 === 17 ? 'PASS' : 'FAIL'}\n`);

// Test 3: 7 critical (from your first screenshot)
const test3 = [
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' },
  { severity: 'critical' }
];
const score3 = calculateUXScore(test3);
console.log(`Test 3 - 7 critical:`);
console.log(`  Calculation: 100 - (7 × 15) = 100 - 105 = -5 → capped at 0`);
console.log(`  Expected: 0`);
console.log(`  Got: ${score3}`);
console.log(`  ✓ ${score3 === 0 ? 'PASS' : 'FAIL'}\n`);

// Test 4: Mixed severities
const test4 = [
  { severity: 'critical' },
  { severity: 'high' },
  { severity: 'medium' },
  { severity: 'low' }
];
const score4 = calculateUXScore(test4);
console.log(`Test 4 - Mixed (1 critical, 1 high, 1 medium, 1 low):`);
console.log(`  Calculation: 100 - 15 - 15 - 8 - 3 = 59`);
console.log(`  Expected: 59`);
console.log(`  Got: ${score4}`);
console.log(`  ✓ ${score4 === 59 ? 'PASS' : 'FAIL'}\n`);

// Test 5: Only low severity issues
const test5 = [
  { severity: 'low' },
  { severity: 'low' },
  { severity: 'low' }
];
const score5 = calculateUXScore(test5);
console.log(`Test 5 - 3 low severity:`);
console.log(`  Calculation: 100 - (3 × 3) = 91`);
console.log(`  Expected: 91`);
console.log(`  Got: ${score5}`);
console.log(`  ✓ ${score5 === 91 ? 'PASS' : 'FAIL'}\n`);

console.log('=== All tests completed ===');
