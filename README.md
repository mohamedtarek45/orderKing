# 🚀 OrderKing

This project contains:

- 🖥 Backend (Fastify + Supabase)
- 🌐 Frontend (React + Vite)
- 📱 Mobile App (React Native + Expo)

---

## 📦 Project Structure

```
/backend
/frontend
/mobile
```

---

## ⚙️ Environment Variables

### Backend (.env)

Create `.env` inside `/backend`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Frontend (.env)

Create `.env` inside `/frontend`:

```
VITE_PUBLIC_API_URL=http://localhost:3000
```

### Mobile (.env)

Create `.env` inside `/mobile`:

```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
```

👉 **How to get your local IP (Windows):**

1. Open **Command Prompt** 
2. 
   ```bash
   ipconfig
   ```
3. You'll see a lot of information — look for the line called IPv4 Address (found under the Wireless LAN adapter Wi-Fi section).
4. Take that value (example: 192.168.1.10) and use it instead of YOUR_LOCAL_IP.

Example:

```
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000
```

---

## 🚀 Installation

### 1️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on: `http://localhost:3000`

### 2️⃣ Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3️⃣ Mobile (React Native Expo)

```bash
cd mobile
npm install
npx expo start
```

Then scan the QR code using **Expo Go**.

---

## 🔌 API Connection

- Frontend → `http://localhost:3000`
- Mobile → `http://YOUR_IP:3000`

⚠️ **Mobile must use IP, not localhost**

---

## 🧠 Tech Stack

- Fastify
- Supabase
- React + Vite
- React Native + Expo
- TypeScript
- Zod validation

---

## 📌 Notes

- Always update `.env` per environment
- Restart server after env changes
- Mobile requires the same WiFi network as the backend