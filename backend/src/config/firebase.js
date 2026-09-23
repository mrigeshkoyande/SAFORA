const admin = require('firebase-admin');

// Ensure you have these variables in your .env
// We parse the private key to handle newline characters properly in env strings
let firebaseApp;

try {
  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('✅ Firebase Admin Initialized Successfully');
  } else {
    firebaseApp = admin.app();
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error.message);
}

module.exports = firebaseApp;
