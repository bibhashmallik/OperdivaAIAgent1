// Mock Date.now and Date to shift time back by 2 years to match real-world time (2024)
const realNow = Date.now;
const realDate = Date;
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000; // ~63,072,000,000 ms

Date.now = function() {
  return realNow() - TWO_YEARS_MS;
};

// Simple Mock Date class
global.Date = class extends realDate {
  constructor(...args) {
    if (args.length === 0) {
      super(realNow() - TWO_YEARS_MS);
    } else {
      super(...args);
    }
  }
  static now() {
    return realNow() - TWO_YEARS_MS;
  }
};

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

try {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json.json');
  if (!fs.existsSync(keyPath)) {
    console.error('Error: serviceAccountKey.json.json not found!');
    process.exit(1);
  }
  
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin initialized with time-mock. Testing key validity online...');
  console.log('Mocked Date:', new Date().toString());
  
  admin.auth().listUsers(1)
    .then(listUsersResult => {
      console.log('🎉 SUCCESS! The time-mocked key has been verified online!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ FAILED: Google rejected the key even with time-mock. Details:');
      console.error(err.message);
      process.exit(1);
    });
} catch (e) {
  console.error('Syntax/Parsing error inside key file:', e.message);
  process.exit(1);
}
