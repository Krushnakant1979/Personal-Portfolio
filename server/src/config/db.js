const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');

const connectDB = () => {
  try {
    const serviceAccountPath = path.resolve(__dirname, 'firebaseServiceAccount.json');
    const app = initializeApp({
      credential: cert(require(serviceAccountPath))
    });
    console.log('Firebase Firestore Connected Successfully');
    return getFirestore(app);
  } catch (error) {
    console.error(`Firebase Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const db = connectDB();
module.exports = { db, FieldValue };
