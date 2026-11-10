import test from 'node:test';
import assert from 'node:assert/strict';
import { symptoms, departments, medicines, recommendCare, searchSymptoms, mapUrl } from '../src/data.js';

test('all pamphlet symptom groups have Korean phrases and a department', () => {
  assert.ok(symptoms.length >= 50);
  for (const symptom of symptoms) {
    assert.ok(departments[symptom.department], symptom.id);
    assert.ok(symptom.ko && symptom.pronunciation, symptom.id);
  }
});
test('three non-emergency severity levels suggest the correct care tier', () => {
  for (const symptom of symptoms.filter(s => !s.emergency)) {
    assert.equal(recommendCare(symptom.id, 'mild').tier, 1);
    assert.equal(recommendCare(symptom.id, 'specialist').tier, 2);
    assert.equal(recommendCare(symptom.id, 'complex').tier, 3);
  }
});
test('emergency warning signs override any selected severity', () => {
  assert.equal(recommendCare('cold', 'mild', true).emergency, true);
  assert.equal(recommendCare('stroke', 'mild').emergency, true);
  assert.equal(recommendCare('breathlessness', 'complex').emergency, true);
});
test('unknown symptoms and severity cannot silently yield a recommendation', () => {
  assert.throws(() => recommendCare('unknown', 'mild'));
  assert.throws(() => recommendCare('cold', 'unknown'));
});
test('symptom search supports English and Korean', () => {
  assert.ok(searchSymptoms('headache').some(s => s.id === 'headache'));
  assert.ok(searchSymptoms('두통').some(s => s.id === 'headache'));
  assert.deepEqual(searchSymptoms('zzzzzz'), []);
});
test('all seven pharmacy topics include product examples and safety guidance', () => {
  assert.equal(medicines.length, 7);
  for (const medicine of medicines) {
    assert.ok(medicine.examples && medicine.ingredient && medicine.caution);
    assert.ok(medicine.phrase && medicine.pronunciation);
  }
});
test('map search encodes Korean query and location', () => {
  const url = new URL(mapUrl('내과', 'Seoul 서울'));
  assert.equal(url.hostname, 'www.google.com');
  assert.equal(url.searchParams.get('query'), 'Seoul 서울 내과');
});
