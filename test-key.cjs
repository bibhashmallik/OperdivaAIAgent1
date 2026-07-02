const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

try {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json.json');
  if (!fs.existsSync(keyPath)) {
    console.error('Error: serviceAccountKey.json.json not found in this folder!');
    process.exit(1);
  }
  
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin initialized. Testing key validity...');
  
  // Try to list users (this forces a network call to fetch a Google OAuth2 token and validates the signature)
  admin.auth().listUsers(1)
    .then(listUsersResult => {
      console.log('🎉 SUCCESS! The key has been verified online and is fully active!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ FAILED: The key was rejected by Google. Details:');
      console.error(err.message);
      process.exit(1);
    });
} catch (e) {
  console.error('Syntax/Parsing error inside key file:', e.message);
  process.exit(1);
}
