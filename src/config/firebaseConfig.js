const admin = require('firebase-admin');
const serviceAccount = require('./docbook-67847-firebase-adminsdk-dxh7i-1f387b44c9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

module.exports = db;
