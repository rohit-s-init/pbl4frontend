/**
 * Simulated API services for the Medication Reminder System.
 * Uses Promises and setTimeout to mimic real network requests.
 */

const DELAY = 800;

// Mock Data Generators
const generateId = () => Math.floor(Math.random() * 1000000);

const MOCK_SCHEDULES = [
  { id: 1, message: "Hello Rohit, did you take your morning medicine?", time: "08:00", label: "Morning", isActive: true },
  { id: 2, message: "Hi Rohit, it's time for your evening dose.", time: "20:00", label: "Night", isActive: true },
];

const MOCK_CALLS = [
  { id: 101, scheduleId: 1, timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: "completed", twilioSid: "CA123456789" },
  { id: 102, scheduleId: 2, timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), status: "completed", twilioSid: "CA987654321" },
  { id: 103, scheduleId: 1, timestamp: new Date(Date.now() - 3600000 * 26).toISOString(), status: "failed", twilioSid: "CA555555555" },
];

const MOCK_RESPONSES = [
  { id: 201, callId: 101, speechText: "yes", interpretedIntent: "YES", timestamp: new Date(Date.now() - 3600000 * 2 + 60000).toISOString() },
  { id: 202, callId: 102, speechText: "not yet", interpretedIntent: "NO", timestamp: new Date(Date.now() - 3600000 * 24 + 120000).toISOString() },
];

// Local Storage Keys
const STORAGE_KEYS = {
  SCHEDULES: 'medcall_schedules',
  USER: 'medcall_user',
  TOKEN: 'medcall_token',
};

// Helper to get from local storage or use mock
const getFromStorage = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  // Auth
  login: async (phone: string) => {
    /**
     * REAL API REQUEST:
     * const response = await fetch("/api/auth/login", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify({ phone }),
     * });
     * return response.json();
     */
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const user = { id: 1, name: "Rohit Sawant", phone, email: "rohit@example.com" };
    saveToStorage(STORAGE_KEYS.USER, user);
    saveToStorage(STORAGE_KEYS.TOKEN, "simulated-jwt-token");
    return { success: true, user };
  },

  sendOtp: async (phone: string) => {
    /**
     * REAL API REQUEST:
     * const response = await fetch("/api/auth/send-otp", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify({ phone }),
     * });
     * return response.json();
     */
    await new Promise(resolve => setTimeout(resolve, DELAY));
    console.log(`OTP sent to ${phone}: 123456`);
    return { success: true };
  },

  verifyOtp: async (phone: string, otp: string, userData?: any) => {
    /**
     * REAL API REQUEST:
     * const response = await fetch("/api/auth/verify-otp", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify({ phone, otp, ...userData }),
     * });
     * return response.json();
     */
    await new Promise(resolve => setTimeout(resolve, DELAY));
    if (otp === '123456') {
      const user = { id: 1, name: userData?.name || "New User", phone, email: userData?.email || "" };
      saveToStorage(STORAGE_KEYS.USER, user);
      saveToStorage(STORAGE_KEYS.TOKEN, "simulated-jwt-token");
      return { success: true, user };
    }
    throw new Error("Invalid OTP");
  },

  logout: async () => {
    /**
     * REAL API REQUEST:
     * const response = await fetch("/api/auth/logout", { method: "POST" });
     * return response.json();
     */
    await new Promise(resolve => setTimeout(resolve, DELAY));
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    return { success: true };
  },

  getMe: async () => {
    /**
     * REAL API REQUEST:
     * const response = await fetch("/api/auth/me");
     * if (!response.ok) return null;
     * const data = await response.json();
     * return data.user;
     */
    await new Promise(resolve => setTimeout(resolve, 100));
    const user = getFromStorage(STORAGE_KEYS.USER, null);
    const token = getFromStorage(STORAGE_KEYS.TOKEN, null);
    if (user && token) return user;
    return null;
  },

  // Schedules
  getSchedules: async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    return getFromStorage(STORAGE_KEYS.SCHEDULES, MOCK_SCHEDULES);
  },

  createSchedule: async (schedule: any) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const schedules = getFromStorage(STORAGE_KEYS.SCHEDULES, MOCK_SCHEDULES);
    const newSchedule = { ...schedule, id: generateId() };
    const updated = [...schedules, newSchedule];
    saveToStorage(STORAGE_KEYS.SCHEDULES, updated);
    return newSchedule;
  },

  updateSchedule: async (id: number, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const schedules = getFromStorage(STORAGE_KEYS.SCHEDULES, MOCK_SCHEDULES);
    const updated = schedules.map((s: any) => s.id === id ? { ...s, ...updates } : s);
    saveToStorage(STORAGE_KEYS.SCHEDULES, updated);
    return updated.find((s: any) => s.id === id);
  },

  deleteSchedule: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const schedules = getFromStorage(STORAGE_KEYS.SCHEDULES, MOCK_SCHEDULES);
    const updated = schedules.filter((s: any) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SCHEDULES, updated);
    return { success: true };
  },

  // Logs
  getCalls: async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    return MOCK_CALLS;
  },

  getResponses: async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    return MOCK_RESPONSES;
  },

  // Profile
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    return getFromStorage(STORAGE_KEYS.USER, { id: 1, name: "Rohit Sawant", phone: "+91 9876543210", email: "rohit@example.com" });
  },

  updateProfile: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    saveToStorage(STORAGE_KEYS.USER, userData);
    return userData;
  }
};
