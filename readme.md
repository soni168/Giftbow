# 🌈 Giftbow

**Giftbow** is a smart AI-powered gift recommendation web app that helps you find the perfect gift for your loved ones. Whether it's a birthday, anniversary, wedding, or festival — Giftbow has you covered with curated product listings, an AI chat assistant, and a smooth, modern experience.

---

## 🚀 Live Demo

🔗 [https://giftbow.onrender.com](https://giftbow.onrender.com)

---

## ✨ Features

- 🎁 **Gift Recommendations** — Browse trending and curated gifts by occasion, relationship, and budget
- 🤖 **AI Chat Assistant** — Get personalized gift suggestions powered by Groq AI
- 🔐 **OTP Email Verification** — Secure signup with a one-time password sent to your email via Resend
- 🔑 **Google OAuth Login** — Sign in instantly with your Google account
- ☁️ **Image Uploads** — Profile avatar uploads powered by Cloudinary
- 💾 **Save Gifts** — Save your favourite gift ideas to your personal profile
- 🔄 **Auto-Refreshing Products** — Gift listings auto-fetch every 12 hours via cron jobs
- 📱 **Responsive Design** — Works beautifully on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 (Vite) | UI Framework |
| Tailwind CSS v4 | Styling |
| React Router DOM v7 | Client-side routing |
| Zustand | State management |
| Axios | HTTP requests |
| React Masonry CSS | Masonry grid layout |
| Groq AI | AI chat integration |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose | Database |
| JWT + Cookie Parser | Authentication |
| Passport.js | Google OAuth |
| bcryptjs | Password hashing |
| Resend | OTP email delivery |
| Cloudinary + Multer | Image storage & uploads |
| Groq AI | AI chat integration |
| node-cron | Scheduled product refresh |
| Axios | External API calls |

---

## 📁 Project Structure

```
Giftbow/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # App pages
│   │   └── store/           # Zustand state management
│   └── dist/                # Production build (auto-generated)
├── server/                  # Node.js backend
│   ├── config/              # DB, Passport, Email, Cloudinary config
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes (auth, gifts, products, chat)
│   └── server.js            # Entry point
├── package.json             # Root package
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://giftbow.onrender.com

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://giftbow.onrender.com/api/auth/google/callback

RESEND_API_KEY=your_resend_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🧑‍💻 Local Development

```bash
# Clone the repo
git clone https://github.com/soni168/Giftbow.git
cd Giftbow

# Install root dependencies
npm install

# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client

# Run backend (from server folder)
cd server && node server.js

# Run frontend (from client folder)
cd client && npm run dev
```

---

## 🚢 Deployment (Render)

The entire app — frontend and backend — is deployed together on **Render**.

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install && npm install --prefix server && npm install --prefix client && npm run build --prefix client` |
| **Start Command** | `node server/server.js` |

The Express server serves the React `dist/` build as static files, so only one Render service is needed.

---

## 🔗 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register with OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/gifts` | Get all gifts |
| POST | `/api/gifts` | Save a gift |
| GET | `/api/products` | Get products |
| POST | `/api/chat` | AI chat (Groq) |

---

## 👩‍💻 Author

Made with 💖 by **Soni Chaudhary**

---

## 📄 License

This project is for personal and educational use.