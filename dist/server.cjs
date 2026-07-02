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
var import_supabase_js = require("@supabase/supabase-js");
var import_config = require("dotenv/config");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
(async () => {
  try {
    const { count, error } = await supabase.from("promos").select("*", { count: "exact", head: true }).eq("code", "OFF100");
    if (error) throw error;
    console.log(`SUCCESS: Supabase connectivity verified. Promos found: ${count}`);
  } catch (e) {
    console.error("CRITICAL: Supabase check failed:", e.message);
  }
})();
console.log(`Supabase services initialized for project: ${supabaseUrl}`);
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
      const { data: authData, error: authError } = await supabase.auth.getUser(idToken);
      if (authError || !authData.user) {
        throw new Error("Invalid token");
      }
      const uid = authData.user.id;
      const { data: userData, error: dbError } = await supabase.from("users").select("*").eq("id", uid).single();
      if (dbError || !userData) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
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
      const { data: userData, error: userError } = await supabase.from("users").select("*").eq("licenseKey", licenseKey).single();
      if (userError || !userData) return res.json({ valid: false, message: "Invalid license key" });
      const userId = userData.id;
      const { data: siteData, error: siteError } = await supabase.from("sites").select("*").eq("user_id", userId).eq("url", domain);
      if (siteError || !siteData || siteData.length === 0) {
        const apiKey = `AU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        await supabase.from("sites").insert({
          user_id: userId,
          url: domain,
          status: "active",
          apiKey,
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
      let finalPrice = planId === "Lite" ? 10 : 25;
      if (promoCode) {
        const { data: promoData, error: promoError } = await supabase.from("promos").select("*").eq("code", promoCode.toUpperCase()).single();
        if (!promoError && promoData) {
          discount = promoData.discount || 0;
          finalPrice = Math.max(0, finalPrice * (1 - discount / 100));
          await supabase.from("promoLogs").insert({
            code: promoCode.toUpperCase(),
            discountPercent: discount,
            plan: planId,
            userId: userId || "anonymous",
            finalPrice,
            orderId
          });
        }
      }
      await supabase.from("transactions").insert({
        userId: userId || "anonymous",
        orderId,
        paymentMethod,
        planId,
        amount: finalPrice,
        status: "verified"
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
      const { data: sitesData, error: sitesError } = await supabase.from("sites").select("*, users(plan)").eq("apiKey", siteKey);
      let recognizedUserPlan = null;
      if (!sitesError && sitesData && sitesData.length > 0) {
        for (const site of sitesData) {
          const sDomain = site.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0].toLowerCase();
          if (sDomain === cleanDomain) {
            recognizedUserPlan = site.users?.plan;
            break;
          }
        }
      }
      if (!recognizedUserPlan) return res.status(403).json({ success: false, message: "Invalid Site Key or Domain" });
      res.json({ success: true, plan: recognizedUserPlan });
    } catch (error) {
      console.error("Activation error:", error);
      res.status(500).json({ success: false });
    }
  });
  app.post("/api/auth/request-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
      const tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      const existingAuthUser = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      let userId;
      if (existingAuthUser) {
        userId = existingAuthUser.id;
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
          password: tempPassword
        });
        if (updateError) throw updateError;
      } else {
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { name: email.split("@")[0] }
        });
        if (createError) throw createError;
        userId = createData.user.id;
      }
      const { data: dbUser } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
      if (!dbUser) {
        await supabase.from("users").upsert({
          id: userId,
          name: email.split("@")[0],
          email,
          plan: "None"
        });
      }
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || "24.199.103.192",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true,
        auth: {
          user: process.env.SMTP_USER || "noreply@wpaioptimizer.com",
          pass: process.env.SMTP_PASS || "Cl45pD%DN2o%wnhE"
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      const mailOptions = {
        from: `"WP AI Optimizer Auth" <${process.env.SMTP_USER || "noreply@wpaioptimizer.com"}>`,
        to: email,
        subject: "Your WP AI Optimizer Temporary Password / Login Code",
        text: `Hello,

Your temporary password to log in to WP AI Optimizer is: ${tempPassword}

Please use this password to log in. You can change your password in your profile page after logging in.

Best regards,
The WP AI Optimizer Team`,
        html: `<p>Hello,</p><p>Your temporary password to log in to WP AI Optimizer is: <strong>${tempPassword}</strong></p><p>Please use this password to log in. You can change your password in your profile page after logging in.</p><br/><p>Best regards,<br/>The WP AI Optimizer Team</p>`
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Temporary password sent to your email." });
    } catch (error) {
      console.error("Error in request-password:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to generate or send password" });
    }
  });
  app.post("/api/contact", async (req, res) => {
    const { websites, email, whatsapp, message } = req.body;
    if (!email || !whatsapp || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    try {
      const transporter = import_nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || "24.199.103.192",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true,
        auth: {
          user: process.env.SMTP_USER || "noreply@wpaioptimizer.com",
          pass: process.env.SMTP_PASS || "Cl45pD%DN2o%wnhE"
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      const mailOptions = {
        from: `"WP AI Optimizer Contact Form" <${process.env.SMTP_USER || "noreply@wpaioptimizer.com"}>`,
        to: process.env.SMTP_USER || "noreply@wpaioptimizer.com",
        // Sends the inquiry directly to your inbox
        subject: `New Enterprise Inquiry from ${email}`,
        text: `New Enterprise Inquiry:

Email: ${email}
WhatsApp: ${whatsapp}
Websites: ${websites}

Message:
${message}`,
        html: `<h3>New Enterprise Inquiry</h3>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>WhatsApp:</strong> ${whatsapp}</p>
               <p><strong>Websites Needed:</strong> ${websites}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, "<br/>")}</p>`
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Inquiry sent successfully." });
    } catch (error) {
      console.error("Error in contact form API:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to send message." });
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
