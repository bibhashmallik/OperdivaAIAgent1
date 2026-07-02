# CyberPanel Node.js Deployment Guide

This document is a step-by-step reference on how we successfully deployed your React + Node.js (Vite) application onto CyberPanel. Keep this handy for the next time you need to launch a new site!

## 1. Push Your Code to GitHub
Before touching CyberPanel, your code needs to be safely on GitHub.
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

## 2. Set Up the CyberPanel Folder
By default, your terminal logs you in as `root`. You must always navigate to your website's folder first.

```bash
# 1. Ensure the public_html folder exists
mkdir -p /home/yourdomain.com/public_html

# 2. Enter the folder (CRITICAL STEP!)
cd /home/yourdomain.com/public_html

# 3. Pull your code from GitHub
git init
git remote add origin https://github.com/your-username/your-repo.git
git fetch
git reset --hard origin/main

# 4. Set correct file permissions for the CyberPanel user
chown -R your_cyberpanel_user:your_cyberpanel_user /home/yourdomain.com/public_html
```

## 3. The Port Conflict (Crucial Fix)
CyberPanel uses port `3000` internally for its own proxy (`nghttpx`). If your Node app runs on port 3000, it creates an infinite loop resulting in a **431 Request Header Fields Too Large** error.
* **The Fix**: Always run your Node apps on custom ports (e.g., `3055`, `3056`, etc.) on CyberPanel.
* Change your port in your `server.ts` or `.env` file before building.

## 4. Build and Run the App (Production Mode)
Once your code is on the server and the port is changed, install dependencies and start the app using `pm2`.

> [!WARNING] 
> You MUST set `NODE_ENV=production`. If you don't, Vite will block external traffic with a "Blocked request. This host is not allowed" error.

```bash
# Install dependencies and build
npm install
npm run build

# Start PM2 in strictly Production Mode
NODE_ENV=production pm2 start dist/server.cjs --name "my_app_name"

# Save the PM2 list so it automatically starts on server reboot
pm2 save --force
```

## 5. Setup the Reverse Proxy
Now you must tell CyberPanel to forward web traffic (port 80/443) to your Node application's custom port.

1. Go to **CyberPanel Dashboard > Websites > List Websites > Manage**.
2. Click **vHost Conf**.
3. Add the following to the very bottom, making sure the `address` matches your custom port (e.g., 3055):
```text
extprocessor nodeapp {
  type proxy
  address 127.0.0.1:3055
  maxConns 100
  pcKeepAliveTimeout 60
  initTimeout 60
  retryTimeout 0
  respBuffer 0
}

context / {
  type proxy
  handler nodeapp
  addDefaultCharset off
}
```
4. Save the configuration.

## 6. Restart LiteSpeed
Your changes in CyberPanel won't fully apply until the web server restarts. Run this in your terminal:
```bash
systemctl restart lsws
```

---

## 🛑 Troubleshooting Reference

* **431 Request Header Fields Too Large**: 
  * If the port is correct, this is usually caused by bad browser cookies. Clear your cookies for the domain or test in Incognito.
  * If it happens in Incognito, it means your reverse proxy is trapped in an infinite loop (usually because your app is on port 3000).
* **503 Service Unavailable**:
  * Your Node app has crashed. Check logs via `pm2 logs`.
  * You forgot to run `systemctl restart lsws` after updating the vHost Conf.
* **Blocked request. This host is not allowed**:
  * Your Node app is running in Development Mode. Delete the pm2 process (`pm2 delete <name>`) and start it again with `NODE_ENV=production`.
* **[PM2][ERROR] Script not found: /root/dist/server.cjs**:
  * You ran `pm2 start` while inside the `/root` directory. Delete the process, run `cd /home/yourdomain.com/public_html`, and start it again.
* **invalid_grant: Invalid JWT Signature (Firebase Admin)**:
  * **Clock Desync:** If your server time differs from Google's servers by even a minute, authorization fails. Step the clock using:
    ```bash
    sudo systemctl stop systemd-timesyncd
    sudo apt-get update && sudo apt-get install -y ntpdate
    sudo ntpdate pool.ntp.org
    sudo systemctl start systemd-timesyncd
    ```
  * **Corrupted Key (SSH Paste Limit):** If you pasted your service account credentials key over SSH, terminal buffer wrapping can drop characters. Do **NOT** paste the key over SSH. Instead, go to the **CyberPanel File Manager** in your web browser, create/edit the file, and upload/paste the clean JSON directly.
* **MODULE_NOT_FOUND (Cannot find module 'dotenv/config')**:
  * Ensure that `dotenv` is included under `dependencies` in your `package.json` file and you have run `npm install` on the server before building the application.

