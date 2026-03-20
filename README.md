# 🚀 Frontend – Call Scheduling & OTP Verification App
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ibb.co/65VtvtJ" />
<img width="1200" height="475" alt="GHBanner" src="https://ibb.co/CpnsR8gk" />
<img width="1200" height="475" alt="GHBanner" src="https://ibb.co/qY7gJkMD" />
<img width="1200" height="475" alt="GHBanner" src="https://ibb.co/d06mpJwB" />
<img width="1200" height="475" alt="GHBanner" src="https://ibb.co/jkRQsfdP" />
<img width="1200" height="475" alt="GHBanner" src="https://ibb.co/jv2xgF9Y" />
</div>
A modern React-based frontend for a call scheduling platform that supports **OTP authentication**, **JWT-based sessions**, and **call credit management**.

---

## ✨ Features

* 🔐 **User Authentication**

  * Register/Login with phone/email
  * OTP verification (via Twilio backend)

* 📞 **Call Credits System**

  * Displays available call credits
  * Syncs with backend dynamically

* ⏳ **Call Scheduling**

  * Schedule automated calls
  * Integration with cron-based backend

* ⚡ **Real-time UI Feedback**

  * Loading states
  * Success/error handling
  * Smooth animations

* 🧠 **Global State Management**

  * Auth + credits handled via Context API
  * Persistent user session using JWT

---

## 🛠️ Tech Stack

* **React** (with Hooks)
* **TypeScript**
* **React Router**
* **Context API** (Auth management)
* **Tailwind CSS / Custom CSS**
* **Framer Motion** (animations)
* **Lucide Icons**

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components (OTPModal, Buttons, etc.)
├── pages/             # Route-based pages (Login, Register, Home)
├── context/           # AuthContext (global state)
├── services/          # API layer (backend calls)
├── utils/             # Helper functions
├── styles/            # CSS / Tailwind configs
└── App.tsx            # Main app with routing
```

---

## 🔑 Authentication Flow

1. User enters phone/email
2. Backend sends OTP (Twilio)
3. User verifies OTP
4. JWT token is issued
5. Token stored in localStorage
6. AuthContext loads user + credits globally

---

## 🔄 Credits (Call Availability) Flow

* Credits are fetched from backend:

  ```
  GET /api/user/credits
  ```

* Stored globally in `AuthContext`

* Accessible anywhere using:

```ts
const { credits } = useAuth();
```

* Updated automatically after actions like:

  * Scheduling a call
  * Purchasing credits (future scope)

---

## 🌐 API Integration

All API calls are centralized in:

```
src/services/api.ts
```

Example:

```ts
export const api = {
  totalCallsAvaliable: async () => {
    return fetch("/api/calls").then(res => res.json());
  }
};
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/project.git
cd project/frontend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

---

### 4. Run the app

```bash
npm run dev
```

---

## 🧠 State Management

Global state is handled via **AuthContext**:

```ts
const { user, credits, setCredits } = useAuth();
```

* Prevents state reset on navigation
* Ensures consistent data across pages

---

## ⚠️ Common Issues

### State resetting on navigation

✔ Fixed by using Context instead of local `useState`

### OTP not working

* Check backend Twilio config
* Ensure correct API URL

### Unauthorized requests

* Verify JWT token is stored and sent in headers

---

## 🔮 Future Improvements

* 💳 Payment integration for buying credits
* 📊 Dashboard with analytics
* 🔔 Notifications system
* 📱 Mobile responsiveness improvements
* 🌍 Internationalization

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ by **Rohit Sawant**
