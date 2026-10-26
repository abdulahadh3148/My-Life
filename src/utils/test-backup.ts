import {
  getInitialState,
  createBackupEnvelope,
  computeRecordCounts,
  validateImportedData,
  AppStateData
} from './storage.ts';

declare const process: any;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    if (typeof process !== 'undefined' && process.exit) {
      process.exit(1);
    } else {
      throw new Error(msg);
    }
  } else {
    console.log(`✅ PASSED: ${msg}`);
  }
}

console.log('\n========================================');
console.log('--- Phase 1: Local Backup & Validation Tests ---');
console.log('========================================\n');

// 1. Initial State & Counts Test
const state: AppStateData = getInitialState();
const counts = computeRecordCounts(state);
assert(counts.activities > 0, `Initial state has activities (${counts.activities})`);
assert(counts.incomes > 0, `Initial state has incomes (${counts.incomes})`);
assert(counts.expenses > 0, `Initial state has expenses (${counts.expenses})`);
assert(counts.debts > 0, `Initial state has debts (${counts.debts})`);
assert(counts.debtPayments > 0, `Initial state has nested debt payments (${counts.debtPayments})`);
assert(counts.explorerPlaces > 0, `Initial state has explorer places (${counts.explorerPlaces})`);
assert(counts.explorerPhotos > 0, `Initial state has nested explorer photos (${counts.explorerPhotos})`);

// 2. Versioned Backup Envelope Generation
const envelope = createBackupEnvelope(state);
assert(envelope.appIdentifier === 'mylife-os', 'Envelope has appIdentifier === "mylife-os"');
assert(envelope.backupVersion === 1, 'Envelope has backupVersion === 1');
assert(typeof envelope.exportedAt === 'string', 'Envelope has ISO exportedAt timestamp');
assert(envelope.metadata.recordCounts.activities === counts.activities, 'Envelope metadata matches activities count');
assert(envelope.metadata.recordCounts.explorerPhotos === counts.explorerPhotos, 'Envelope metadata matches photos count');

// 3. Serialization and Validation of Envelope
const jsonStr = JSON.stringify(envelope);
const parsedEnvelope = JSON.parse(jsonStr);
const valResult = validateImportedData(parsedEnvelope);
if (!valResult.valid) {
  console.error('valResult failed with error:', valResult.error);
}
assert(valResult.valid === true, 'Enveloped backup validates successfully');
assert(valResult.isLegacy === false, 'Detected as non-legacy enveloped backup');
assert(valResult.backupVersion === 1, 'Backup version 1 verified');
assert(valResult.recordCounts?.activities === counts.activities, 'Validated record counts match original activities');
assert(valResult.recordCounts?.explorerPhotos === counts.explorerPhotos, 'Validated record counts match original photos');
assert(valResult.validatedState !== undefined, 'Validated state is extracted');

// 4. Backward Compatibility: Legacy (raw state) format
const rawLegacyJsonStr = JSON.stringify(state);
const parsedLegacy = JSON.parse(rawLegacyJsonStr);
const legacyValResult = validateImportedData(parsedLegacy);
assert(legacyValResult.valid === true, 'Legacy backup without envelope validates successfully');
assert(legacyValResult.isLegacy === true, 'Detected as legacy backup format');
assert(legacyValResult.recordCounts?.activities === counts.activities, 'Legacy backup record counts correctly computed');
assert(legacyValResult.warnings !== undefined && legacyValResult.warnings.length > 0, 'Legacy backup generates informational warning');
assert(legacyValResult.validatedState !== undefined, 'Legacy backup produces sanitized AppStateData');

// 5. Negative Test: Wrong app identifier
const wrongApp = { ...envelope, appIdentifier: 'wrong-app' };
const wrongAppResult = validateImportedData(wrongApp);
assert(wrongAppResult.valid === false, 'Wrong appIdentifier is rejected');
assert(wrongAppResult.error?.includes('App identifier') === true, 'Error message mentions app identifier');

// 6. Negative Test: Future unsupported backup version
const futureVersion = { ...envelope, backupVersion: 99 };
const futureResult = validateImportedData(futureVersion);
assert(futureResult.valid === false, 'Future backupVersion is rejected');
assert(futureResult.error?.includes('newer MyLife OS backup format') === true, 'Error mentions newer version');

// 7. Negative Test: Duplicate ID in collection
const stateWithDupId: AppStateData = {
  ...state,
  activities: [
    ...state.activities,
    { ...state.activities[0] } // exact duplicate ID
  ]
};
const dupEnvelope = createBackupEnvelope(stateWithDupId);
const dupResult = validateImportedData(dupEnvelope);
assert(dupResult.valid === false, 'Duplicate ID within collection is rejected');
assert(dupResult.error?.toLowerCase().includes('duplicate id') === true, `Duplicate ID error: ${dupResult.error}`);

// 8. Negative Test: Duplicate ID in nested debt payments
const debtWithDupPayment = {
  ...state.debts[0],
  payments: [
    { id: 'pay-dup', amount: 500, date: '2026-10-25' },
    { id: 'pay-dup', amount: 300, date: '2026-10-26' }
  ]
};
const stateWithDupPayment: AppStateData = {
  ...state,
  debts: [debtWithDupPayment, ...state.debts.slice(1)]
};
const dupPayEnvelope = createBackupEnvelope(stateWithDupPayment);
const dupPayResult = validateImportedData(dupPayEnvelope);
assert(dupPayResult.valid === false, 'Duplicate ID in nested debt payments is rejected');
assert(dupPayResult.error?.includes('Duplicate payment ID') === true, `Duplicate payment ID error: ${dupPayResult.error}`);

// 9. Negative Test: Duplicate ID in nested explorer photos
const placeWithDupPhoto = {
  ...state.explorerPlaces[0],
  photos: [
    { id: 'photo-dup', url: 'https://example.com/1.jpg', uploadedAt: '2026-10-25' },
    { id: 'photo-dup', url: 'https://example.com/2.jpg', uploadedAt: '2026-10-25' }
  ]
};
const stateWithDupPhoto: AppStateData = {
  ...state,
  explorerPlaces: [placeWithDupPhoto, ...state.explorerPlaces.slice(1)]
};
const dupPhotoEnvelope = createBackupEnvelope(stateWithDupPhoto);
const dupPhotoResult = validateImportedData(dupPhotoEnvelope);
assert(dupPhotoResult.valid === false, 'Duplicate ID in nested explorer photos is rejected');
assert(dupPhotoResult.error?.includes('Duplicate photo ID') === true, `Duplicate photo ID error: ${dupPhotoResult.error}`);

// 10. Negative Test: Malformed number in expense
const stateWithBadExpense: any = {
  ...state,
  expenses: [
    { id: 'exp-bad', amount: NaN, category: 'food', date: '2026-10-25' }
  ]
};
const badExpenseEnvelope = createBackupEnvelope(stateWithBadExpense);
const badExpResult = validateImportedData(badExpenseEnvelope);
assert(badExpResult.valid === false, 'NaN amount in expense is rejected');

// 11. Negative Test: Non-object payload
const invalidStringResult = validateImportedData('not an object');
assert(invalidStringResult.valid === false, 'String payload is rejected');

const nullResult = validateImportedData(null);
assert(nullResult.valid === false, 'Null payload is rejected');

console.log('\n========================================');
console.log('🎉 ALL 11 TESTS PASSED WITH 100% SUCCESS!');
console.log('========================================\n');
