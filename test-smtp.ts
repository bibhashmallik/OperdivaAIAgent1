import nodemailer from 'nodemailer';

async function testSMTP() {
  console.log("Testing connection to mail.wpaioptimizer.com...");

  const transporter = nodemailer.createTransport({
    host: '24.199.103.192',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'noreply@wpaioptimizer.com',
      pass: 'Cl45pD%DN2o%wnhE'
    },
    tls: {
      // Do not fail on invalid certs for testing
      rejectUnauthorized: false
    }
  });

  try {
    const success = await transporter.verify();
    console.log("✅ SUCCESS! Connected to CyberPanel SMTP successfully.");
    console.log(success);
  } catch (error) {
    console.error("❌ FAILED to connect to CyberPanel SMTP.");
    console.error(error);
  }
}

testSMTP();
