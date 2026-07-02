const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function testGoogleAuth() {
  try {
    const keyPath = path.join(__dirname, 'serviceAccountKey.json.json');
    if (!fs.existsSync(keyPath)) {
      console.error('Key file not found!');
      return;
    }
    
    const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log('Using Private Key ID:', key.private_key_id);
    console.log('Using Client Email:', key.client_email);
    console.log('System current time (UTC):', new Date().toISOString());

    // 1. Create JWT Header
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: key.private_key_id
    };

    // 2. Create JWT Claims (issued now, expires in 1 hour)
    const nowSecs = Math.floor(Date.now() / 1000);
    const claims = {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database',
      aud: 'https://oauth2.googleapis.com/token',
      iat: nowSecs,
      exp: nowSecs + 3600
    };

    console.log('JWT claims being sent:', claims);

    // 3. Sign the JWT
    const unsignedToken = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(claims));
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(unsignedToken);
    const signature = base64url(sign.sign(key.private_key));
    const assertion = unsignedToken + '.' + signature;

    // 4. Send token request to Google OAuth2
    console.log('Sending post assertion to https://oauth2.googleapis.com/token ...');
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: assertion
      })
    });

    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Body:', text);
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

testGoogleAuth();
