 # 🌐 TaskHub MCP Connectivity Guide

This guide explains the three primary ways to connect your AI agents (like Claude Desktop) to the TaskHub ecosystem.

---

## 🚀 1. Connection Methods (طرق الاتصال)

### A. Remote HTTP (Cloud Bridge) - **Recommended**
The easiest way for users. No local dependencies required.
1. Generate an API Key in **Settings > API & MCP**.
2. Copy the **Cloud Bridge JSON** snippet.
3. Paste it directly into your `claude_desktop_config.json`.

### B. NPX Bridge (CLI Tool)
Best for running tools locally without cloning code.
1. Ensure Node.js is installed.
2. Use the `command: "npx"` configuration in Claude.
3. Pass your API Key as an environment variable or argument.

### C. Local Source (Development)
Best for developers building new tools.
1. Clone the repo and install dependencies (`bun install`).
2. Point Claude to your local entry point (e.g., `index.ts`).
3. Run directly via `bun` or `node`.

---

## 📊 2. Connection Comparison (مقارنة أنواع الاتصال)

| Feature (الميزة) | **Remote HTTP (SSE)** | **NPX Bridge** | **Local Source** |
| :--- | :--- | :--- | :--- |
| **Setup Speed** (سرعة الإعداد) | ⚡ Fast (1 click) | 🚀 Medium | 🐢 Slow |
| **Maintenance** (الصيانة) | ✅ Automatic | 🛠️ Needs updates | 🏗️ Manual |
| **Security** (الأمان) | 🔓 Header-based | 🔐 Env-based | 🛠️ Manual |
| **Ideal For** (الأفضل لـ) | SaaS Users | Power Users | Developers |
| **Availability** (التوفر) | 🌐 Everywhere | 💻 Direct CLI | 🏠 Local Dev |

---

## 🌍 أفضل أنواع الاتصال (Best Connection Types)

| النوع | المميزات | العيوب | متى تستخدمه؟ |
| :--- | :--- | :--- | :--- |
| **الاتصال السحابي (Remote HTTP)** | أسرع وسيلة، لا يحتاج تثبيت أي ملفات، التحديث تلقائي. | يحتاج اتصال دائم بالإنترنت. | **الخيار الأول** لغالبية المستخدمين. |
| **أداة الـ CLI (NPX)** | تشغيل محلي سريع، يدعم أدوات متعددة بسهولة. | يحتاج تثبيت Node.js، سرعة أقل قليلاً في المرة الأولى. | للمستخدمين المتقدمين والأدوات المنفصلة. |
| **المطور (Local Source)** | تحكم كامل في الكود، مثالي للتعديل والبرمجة. | إعداد معقد، يحتاج Git و Bun وتثبيت مكتبات. | للمطورين فقط. |

---

## 🛠️ Typical Configuration (الإعداد النموذجي)

### Claude Desktop (Windows/macOS)
Path: `%APPDATA%\Claude\claude_desktop_config.json` or `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "taskhub": {
      "type": "http",
      "url": "https://api.ahmedlotfy.site/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_CLIENT_API_KEY"
      }
    }
  }
}
```

---

## 🔐 Security Best Practices (أفضل الممارسات الأمنية)
1. **Never Share Keys**: Keep your `th_live_` keys private.
2. **Rotate Regularly**: Revoke and regenerate keys if you suspect a leak.
3. **Scoped Keys**: Create unique keys for different agents (Claude, Cursor, etc.).
