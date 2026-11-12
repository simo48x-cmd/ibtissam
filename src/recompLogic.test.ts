import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBmi,
  calculateWeightProgress,
  calculateDailyMacros,
  calculateWhr,
  projectTimeline,
} from './recompLogic';

test('calculateBmi computes accurate BMI for Ibtissam (164cm)', () => {
  assert.equal(calculateBmi(76.0, 164), 28.3);
  assert.equal(calculateBmi(60.0, 164), 22.3);
});

test('calculateWeightProgress tracks 76kg to 60kg recomposition progress', () => {
  const start = calculateWeightProgress(76.0, 76.0, 60.0);
  assert.equal(start.lostKg, 0);
  assert.equal(start.remainingKg, 16.0);
  assert.equal(start.progressPercent, 0);

  const mid = calculateWeightProgress(68.0, 76.0, 60.0);
  assert.equal(mid.lostKg, 8.0);
  assert.equal(mid.remainingKg, 8.0);
  assert.equal(mid.progressPercent, 50);
});

test('calculateDailyMacros sums student budget meals within 95-100g protein & 12-17 DH', () => {
  const sampleDay = [
    { id: 'b1', title: 'فطور 1', details: '', protein: 21, carbs: 20, fats: 14, calories: 310, costDh: 3.5, tag: '' },
    { id: 'l1', title: 'غداء 1', details: '', protein: 33, carbs: 24, fats: 16, calories: 410, costDh: 4.5, tag: '' },
    { id: 's1', title: 'سناك 1', details: '', protein: 13, carbs: 8, fats: 6, calories: 155, costDh: 3.5, tag: '' },
    { id: 'd2', title: 'عشاء 2', details: '', protein: 29, carbs: 18, fats: 11, calories: 485, costDh: 3.0, tag: '' },
  ];
  const totals = calculateDailyMacros(sampleDay);
  assert.equal(totals.protein, 96);
  assert.equal(totals.carbs, 70);
  assert.equal(totals.fats, 47);
  assert.equal(totals.calories, 1360);
  assert.equal(totals.costDh, 14.5);
});

test('calculateWhr computes waist-to-hip ratio accurately', () => {
  const res = calculateWhr(74, 102);
  assert.equal(res.ratio, 0.73);
});

test('projectTimeline computes target weeks and milestones for 76kg to 60kg', () => {
  const proj = projectTimeline(76.0, 60.0, 0.7);
  assert.equal(proj.totalWeeks, 23);
  assert.equal(proj.week4Weight, 73.2);
  assert.equal(proj.week8Weight, 70.4);
  assert.equal(proj.week14Weight, 66.2);
  assert.equal(proj.goalWeight, 60.0);
});
