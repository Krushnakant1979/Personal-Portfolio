const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');

const connectDB = () => {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      const serviceAccountPath = path.resolve(__dirname, 'firebaseServiceAccount.json');
      serviceAccount = require(serviceAccountPath);
    }
    const app = initializeApp({
      credential: cert(serviceAccount)
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
