import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { initializeApp as initializeAdmin, getApps, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import nodemailer from "nodemailer";

// Client SDK for Firestore (to bypass IAM issues)
import { initializeApp as initializeClient } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

// Load Firebase configuration
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

// Initialize Firebase Admin (for Auth ONLY)
if (getApps().length === 0) {
  let credential = undefined;
  const keyPath = path.join(process.cwd(), "serviceAccountKey.json.json");
  
  if (fs.existsSync(keyPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
    credential = cert(serviceAccount);
  } else {
    // Fallback if key is missing (e.g. forgot to upload to server)
    console.error("CRITICAL: serviceAccountKey.json.json not found! Custom emails will fail.");
  }

  if (credential) {
    initializeAdmin({ credential });
  }
}

const adminApp = getApps()[0];
const adminAuth = getAdminAuth(adminApp);

// Initialize Client SDK for Firestore
const clientApp = initializeClient(firebaseConfig);
const db = getFirestore(clientApp, firebaseConfig.firestoreDatabaseId);

// Startup check
(async () => {
  try {
    const snap = await getDocs(query(collection(db, "promos"), where("code", "==", "OFF100")));
    console.log(`SUCCESS: Client SDK connectivity verified. Promos found: ${snap.size}`);
  } catch (e: any) {
    console.error("CRITICAL: Client SDK Firestore check failed:", e.message);
  }
})();

console.log(`Firebase services initialized for project: ${firebaseConfig.projectId}`);
console.log(`Firestore target: ${firebaseConfig.firestoreDatabaseId}`);

// Setup Nodemailer Transporter (Update with your CyberPanel SMTP details)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.wpaioptimizer.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "noreply@wpaioptimizer.com",
    pass: process.env.SMTP_PASS || "Cl45pD%DN2o%wnhE",
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // PROTECTED DOWNLOAD ENDPOINT
  app.get("/api/download-plugin", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized. Missing token." });
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
      // 1. Verify the User's ID Token (Admin SDK is fine for this)
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // 2. Check User's Plan in Firestore (Client SDK)
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      const userData = userDoc.data();
      const hasPlan = userData?.plan && (userData.plan === "Lite" || userData.plan === "Pro");

      if (!hasPlan) {
        return res.status(403).json({ success: false, message: "No active plan found. Please purchase a license first." });
      }

      // 3. Serve the file
      const filePath = path.join(process.cwd(), "plugin-v1.zip");
      res.setHeader("Content-Disposition", "attachment; filename=agentic-wp-plugin.zip");
      res.setHeader("Content-Type", "application/zip");
      res.sendFile(filePath);

    } catch (error: any) {
      console.error("Download error:", error);
      res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
  });

  // PUBLIC ENDPOINT FOR WP PLUGINS
  app.post("/api/validate-license", async (req, res) => {
    const { licenseKey, domain } = req.body;
    if (!licenseKey) return res.status(400).json({ valid: false, message: "License key is required" });

    try {
      const userQuery = query(collection(db, "users"), where("licenseKey", "==", licenseKey));
      const userSnap = await getDocs(userQuery);

      if (userSnap.empty) return res.json({ valid: false, message: "Invalid license key" });

      const userDoc = userSnap.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;

      const sitesRef = collection(db, "users", userId, "sites");
      const siteQuery = query(sitesRef, where("url", "==", domain));
      const siteSnap = await getDocs(siteQuery);

      if (siteSnap.empty) {
        await addDoc(sitesRef, {
          url: domain,
          status: "active",
          apiKey: `AU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          createdAt: serverTimestamp(),
          health: 100,
          lastSync: "Auto-activated"
        });
      }

      return res.json({ valid: true, plan: userData.plan, message: "License is active" });
    } catch (error) {
      console.error("License validation error:", error);
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    const { orderId, paymentMethod, planId, promoCode, userId } = req.body;
    console.log(`[PAYMENT] Received verification request for ${planId} from user ${userId}. Method: ${paymentMethod}, Order: ${orderId}`);

    try {
      // Simulate real-world network delay for payment verification
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

      let discount = 0;
      let finalPrice = planId === "Lite" ? 10 : 50;

      if (promoCode) {
        const promoQuery = query(collection(db, "promos"), where("code", "==", promoCode.toUpperCase()));
        const promoSnap = await getDocs(promoQuery);

        if (!promoSnap.empty) {
          const promoData = promoSnap.docs[0].data();
          discount = promoData.discount || 0;
          finalPrice = Math.max(0, finalPrice * (1 - discount / 100));

          await addDoc(collection(db, "promoLogs"), {
            code: promoCode.toUpperCase(),
            discountPercent: discount,
            plan: planId,
            timestamp: serverTimestamp(),
            userId: userId || "anonymous",
            finalPrice,
            orderId
          });
        }
      }

      // Log the transaction attempt
      await addDoc(collection(db, "transactions"), {
        userId: userId || "anonymous",
        orderId,
        paymentMethod,
        planId,
        amount: finalPrice,
        status: "verified",
        timestamp: serverTimestamp()
      });

      const licenseKey = `AUTH-${planId.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      console.log(`[PAYMENT] Verification success for ${orderId}. Plan: ${planId}, Price: ${finalPrice}`);

      return res.json({
        success: true,
        licenseKey,
        finalPrice,
        message: finalPrice === 0 ? "Free plan activated!" : "Payment verified successfully"
      });
    } catch (error: any) {
      console.error("[PAYMENT] Verification error:", error);
      res.status(500).json({ success: false, message: "Verification system error. Please contact support." });
    }
  });

  // PLUGIN ACTIVATION API
  app.post("/api/activate-plugin", async (req, res) => {
    const { domain, siteKey } = req.body;
    if (!domain || !siteKey) return res.status(400).json({ success: false });

    try {
      const cleanDomain = domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0].toLowerCase();

      const usersSnap = await getDocs(collection(db, "users"));
      let recognizedUser = null;

      for (const userDoc of usersSnap.docs) {
        const sitesSnap = await getDocs(query(collection(db, "users", userDoc.id, "sites"), where("apiKey", "==", siteKey)));
        if (!sitesSnap.empty) {
          const siteData = sitesSnap.docs[0].data();
          const sDomain = siteData.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0].toLowerCase();
          if (sDomain === cleanDomain) {
            recognizedUser = userDoc.data();
            break;
          }
        }
      }

      if (!recognizedUser) return res.status(403).json({ success: false, message: "Invalid Site Key" });

      res.json({ success: true, plan: recognizedUser.plan });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  });

  // CUSTOM EMAIL AUTH ENDPOINTS
  app.post("/api/auth/reset-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    try {
      // 1. Generate the raw Firebase password reset link
      const resetLink = await adminAuth.generatePasswordResetLink(email);

      // 2. Send the email using your CyberPanel SMTP
      await transporter.sendMail({
        from: '"WP AI Optimizer" <noreply@wpaioptimizer.com>',
        to: email,
        subject: "Reset your password for WP AI Optimizer",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your WP AI Optimizer account.</p>
            <p>Click the button below to choose a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">Reset Password</a>
            <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      });

      res.json({ success: true, message: "Password reset email sent successfully" });
    } catch (error: any) {
      console.error("Custom reset password error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to send reset email" });
    }
  });

  app.post("/api/auth/verify-email", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    try {
      // 1. Generate the raw Firebase email verification link
      const verificationLink = await adminAuth.generateEmailVerificationLink(email);

      // 2. Send the email using your CyberPanel SMTP
      await transporter.sendMail({
        from: '"WP AI Optimizer" <noreply@wpaioptimizer.com>',
        to: email,
        subject: "Verify your email for WP AI Optimizer",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email</h2>
            <p>Welcome to WP AI Optimizer! Please verify your email address to get started.</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">Verify Email</a>
            <p style="color: #666; font-size: 14px;">If you didn't sign up for this account, you can safely ignore this email.</p>
          </div>
        `
      });

      res.json({ success: true, message: "Verification email sent successfully" });
    } catch (error: any) {
      console.error("Custom verify email error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to send verification email" });
    }
  });

  // Vite/Static Setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
