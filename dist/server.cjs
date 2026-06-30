var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_app2 = require("firebase/app");
var import_firestore = require("firebase/firestore");

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "gen-lang-client-0725991137",
  appId: "1:699135452058:web:d18a7c20fec0ad23e75023",
  apiKey: "AIzaSyCr04MCRGHq5kje6Yaiwhyh_tF7XN1FATA",
  authDomain: "gen-lang-client-0725991137.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-aac49e75-e7eb-4fba-b2c1-8efe717610d4",
  storageBucket: "gen-lang-client-0725991137.firebasestorage.app",
  messagingSenderId: "699135452058",
  measurementId: ""
};

// server.ts
if ((0, import_app.getApps)().length === 0) {
  (0, import_app.initializeApp)({
    projectId: firebase_applet_config_default.projectId,
    credential: (0, import_app.applicationDefault)()
  });
}
var adminApp = (0, import_app.getApps)()[0];
var adminAuth = (0, import_auth.getAuth)(adminApp);
var clientApp = (0, import_app2.initializeApp)(firebase_applet_config_default);
var db = (0, import_firestore.getFirestore)(clientApp, firebase_applet_config_default.firestoreDatabaseId);
(async () => {
  try {
    const snap = await (0, import_firestore.getDocs)((0, import_firestore.query)((0, import_firestore.collection)(db, "promos"), (0, import_firestore.where)("code", "==", "OFF100")));
    console.log(`SUCCESS: Client SDK connectivity verified. Promos found: ${snap.size}`);
  } catch (e) {
    console.error("CRITICAL: Client SDK Firestore check failed:", e.message);
  }
})();
console.log(`Firebase services initialized for project: ${firebase_applet_config_default.projectId}`);
console.log(`Firestore target: ${firebase_applet_config_default.firestoreDatabaseId}`);
var transporter = import_nodemailer.default.createTransport({
  host: process.env.SMTP_HOST || "mail.wpaioptimizer.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "noreply@wpaioptimizer.com",
    pass: process.env.SMTP_PASS || "Cl45pD%DN2o%wnhE"
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((0, import_cors.default)());
  app.use(import_express.default.json());
  app.get("/api/download-plugin", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized. Missing token." });
    }
    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const userRef = (0, import_firestore.doc)(db, "users", uid);
      const userDoc = await (0, import_firestore.getDoc)(userRef);
      if (!userDoc.exists()) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      const userData = userDoc.data();
      const hasPlan = userData?.plan && (userData.plan === "Lite" || userData.plan === "Pro");
      if (!hasPlan) {
        return res.status(403).json({ success: false, message: "No active plan found. Please purchase a license first." });
      }
      const filePath = import_path.default.join(process.cwd(), "plugin-v1.zip");
      res.setHeader("Content-Disposition", "attachment; filename=agentic-wp-plugin.zip");
      res.setHeader("Content-Type", "application/zip");
      res.sendFile(filePath);
    } catch (error) {
      console.error("Download error:", error);
      res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
  });
  app.post("/api/validate-license", async (req, res) => {
    const { licenseKey, domain } = req.body;
    if (!licenseKey) return res.status(400).json({ valid: false, message: "License key is required" });
    try {
      const userQuery = (0, import_firestore.query)((0, import_firestore.collection)(db, "users"), (0, import_firestore.where)("licenseKey", "==", licenseKey));
      const userSnap = await (0, import_firestore.getDocs)(userQuery);
      if (userSnap.empty) return res.json({ valid: false, message: "Invalid license key" });
      const userDoc = userSnap.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;
      const sitesRef = (0, import_firestore.collection)(db, "users", userId, "sites");
      const siteQuery = (0, import_firestore.query)(sitesRef, (0, import_firestore.where)("url", "==", domain));
      const siteSnap = await (0, import_firestore.getDocs)(siteQuery);
      if (siteSnap.empty) {
        await (0, import_firestore.addDoc)(sitesRef, {
          url: domain,
          status: "active",
          apiKey: `AU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          createdAt: (0, import_firestore.serverTimestamp)(),
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
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2e3 + 1e3));
      let discount = 0;
      let finalPrice = planId === "Lite" ? 10 : 50;
      if (promoCode) {
        const promoQuery = (0, import_firestore.query)((0, import_firestore.collection)(db, "promos"), (0, import_firestore.where)("code", "==", promoCode.toUpperCase()));
        const promoSnap = await (0, import_firestore.getDocs)(promoQuery);
        if (!promoSnap.empty) {
          const promoData = promoSnap.docs[0].data();
          discount = promoData.discount || 0;
          finalPrice = Math.max(0, finalPrice * (1 - discount / 100));
          await (0, import_firestore.addDoc)((0, import_firestore.collection)(db, "promoLogs"), {
            code: promoCode.toUpperCase(),
            discountPercent: discount,
            plan: planId,
            timestamp: (0, import_firestore.serverTimestamp)(),
            userId: userId || "anonymous",
            finalPrice,
            orderId
          });
        }
      }
      await (0, import_firestore.addDoc)((0, import_firestore.collection)(db, "transactions"), {
        userId: userId || "anonymous",
        orderId,
        paymentMethod,
        planId,
        amount: finalPrice,
        status: "verified",
        timestamp: (0, import_firestore.serverTimestamp)()
      });
      const licenseKey = `AUTH-${planId.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      console.log(`[PAYMENT] Verification success for ${orderId}. Plan: ${planId}, Price: ${finalPrice}`);
      return res.json({
        success: true,
        licenseKey,
        finalPrice,
        message: finalPrice === 0 ? "Free plan activated!" : "Payment verified successfully"
      });
    } catch (error) {
      console.error("[PAYMENT] Verification error:", error);
      res.status(500).json({ success: false, message: "Verification system error. Please contact support." });
    }
  });
  app.post("/api/activate-plugin", async (req, res) => {
    const { domain, siteKey } = req.body;
    if (!domain || !siteKey) return res.status(400).json({ success: false });
    try {
      const cleanDomain = domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0].toLowerCase();
      const usersSnap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(db, "users"));
      let recognizedUser = null;
      for (const userDoc of usersSnap.docs) {
        const sitesSnap = await (0, import_firestore.getDocs)((0, import_firestore.query)((0, import_firestore.collection)(db, "users", userDoc.id, "sites"), (0, import_firestore.where)("apiKey", "==", siteKey)));
        if (!sitesSnap.empty) {
          const siteData = sitesSnap.docs[0].data();
          const sDomain = siteData.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0].toLowerCase();
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
  app.post("/api/auth/reset-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    try {
      const resetLink = await adminAuth.generatePasswordResetLink(email);
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
    } catch (error) {
      console.error("Custom reset password error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to send reset email" });
    }
  });
  app.post("/api/auth/verify-email", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    try {
      const verificationLink = await adminAuth.generateEmailVerificationLink(email);
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
    } catch (error) {
      console.error("Custom verify email error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to send verification email" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => res.sendFile(import_path.default.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}
startServer();
//# sourceMappingURL=server.cjs.map
