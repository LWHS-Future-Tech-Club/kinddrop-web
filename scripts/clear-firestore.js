/*
 * Destructive Firestore clear script.
 * Deletes ALL documents in 'messages' and 'users'.
 * Requires firebase-admin and a service account.
 * Run with: node scripts/clear-firestore.js --force
 */

const admin = require('firebase-admin');

function requireForceFlag() {
  if (!process.argv.includes('--force')) {
    console.error('Refusing to run without --force. This will DELETE all users and messages.');
    process.exit(1);
  }
}

function initAdmin() {
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const sa = require(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(sa),
      });
    } else {
      console.error('Missing credentials. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT env var.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Failed to initialize firebase-admin:', err);
    process.exit(1);
  }
}

async function clearCollection(db, collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  if (snapshot.empty) {
    console.log(`[${collectionName}] No documents to delete.`);
    return 0;
  }
  const docs = snapshot.docs;
  let deleted = 0;
  // Delete in batches of 500
  for (let i = 0; i < docs.length; i += 500) {
    const batch = db.batch();
    for (let j = i; j < Math.min(i + 500, docs.length); j++) {
      batch.delete(docs[j].ref);
      deleted++;
    }
    await batch.commit();
    console.log(`[${collectionName}] Deleted batch up to ${Math.min(i + 500, docs.length)} / ${docs.length}`);
  }
  return deleted;
}

(async () => {
  requireForceFlag();
  initAdmin();
  const db = admin.firestore();

  console.log('Starting Firestore clear...');
  const deletedMessages = await clearCollection(db, 'messages');
  const deletedUsers = await clearCollection(db, 'users');

  console.log(`Done. Deleted ${deletedMessages} messages and ${deletedUsers} users.`);
  process.exit(0);
})();
