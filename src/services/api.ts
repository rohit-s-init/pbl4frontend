const BASE_URL = "https://pbl4-backend-ten.vercel.app/api";

// =======================
// 🔑 TOKEN HANDLING
// =======================
const getToken = () => localStorage.getItem("medcall_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const saveAuth = (user: any, token: string) => {
  localStorage.setItem("medcall_user", JSON.stringify(user));
  localStorage.setItem("medcall_token", token);
};

const clearAuth = () => {
  console.log("clearing auth")
  localStorage.removeItem("medcall_user");
  localStorage.removeItem("medcall_token");
};

// =======================
// 🌐 API
// =======================
export const api = {

  // =======================
  // 🔐 AUTH
  // =======================
  login: async (phone: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    return res.json();
  },

  sendOtp: async (phone: string) => {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    return res.json();
  },

  verifyOtp: async (phone: string, otp: string, userData?: any) => {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, ...userData }),
    });

    const data = await res.json();

    if (data.success) {
      saveAuth(data.user, data.token);
      console.log("updating user");
    }

    return data;
  },

  verifyOtpLogin: async (phone: string, otp: string) => {
    const res = await fetch(`${BASE_URL}/auth/verify-otp-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();

    if (data.success) {
      saveAuth(data.user, data.token);
    }

    return data;
  },

  logout: async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: authHeaders(),
    });

    clearAuth();
    return { success: true };
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: authHeaders(),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  },

  // =======================
  // 📅 SCHEDULES
  // =======================
  getSchedules: async () => {
    const res = await fetch(`${BASE_URL}/schedules`, {
      headers: authHeaders(),
    });

    const data = await res.json();
    return data.schedules;
  },

  createSchedule: async (schedule: any) => {
    const res = await fetch(`${BASE_URL}/schedules`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(schedule),
    });

    return res.json();
  },

  updateSchedule: async (id: number, updates: any) => {
    const res = await fetch(`${BASE_URL}/schedules/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });

    return res.json();
  },

  deleteSchedule: async (id: number) => {
    const res = await fetch(`${BASE_URL}/schedules/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    return res.json();
  },

  // =======================
  // 📞 CALLS
  // =======================
  getCalls: async () => {
    const res = await fetch(`${BASE_URL}/calls`, {
      headers: authHeaders(),
    });

    const data = await res.json();
    return data.calls;
  },

  getResponses: async () => {
    const res = await fetch(`${BASE_URL}/calls/responses`, {
      headers: authHeaders(),
    });

    const data = await res.json();
    return data.responses;
  },

  // =======================
  // 👤 PROFILE
  // =======================
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      headers: authHeaders(),
    });

    const data = await res.json();
    return data.user;
  },

  updateProfile: async (userData: any) => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(userData),
    });

    return res.json();
  },

  makeCall: async (schedulerId: number) => {
    const res = await fetch(`${BASE_URL}/twilio/call`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        "scheduleId": schedulerId
      })
    });

    return res.json();
  },

  totalCallsAvaliable: async ()=>{
    const response = await fetch(`${BASE_URL}/twilio/avaliablecalls`)
    const credits = await response.json();
    if(credits.success){
      return credits;
    }
  } 

};