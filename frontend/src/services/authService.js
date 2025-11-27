import api from "../utils/axiosConfig";

const ACTIVE_ROLE_KEY = "activeRole";
const isBrowser = () => typeof window !== "undefined";

const readStoredUser = () => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeStoredUser = (user) => {
  if (!isBrowser() || !user) return;
  localStorage.setItem("user", JSON.stringify(user));
};

const persistActiveRole = (role, { syncUser = true } = {}) => {
  if (!isBrowser()) return;
  if (role) {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
    if (syncUser) {
      const currentUser = readStoredUser();
      if (currentUser) {
        writeStoredUser({ ...currentUser, role });
      }
    }
  } else {
    localStorage.removeItem(ACTIVE_ROLE_KEY);
  }
};

const readActiveRole = () => {
  if (!isBrowser()) return "client";
  const stored = localStorage.getItem(ACTIVE_ROLE_KEY);
  if (stored) return stored;
  const user = readStoredUser();
  if (user?.role) {
    localStorage.setItem(ACTIVE_ROLE_KEY, user.role);
    return user.role;
  }
  return "client";
};

const clearActiveRole = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACTIVE_ROLE_KEY);
};

const persistAuthSession = (token, user) => {
  if (!isBrowser()) return;
  localStorage.setItem("token", token);
  writeStoredUser(user);
  persistActiveRole(user?.role || "client", { syncUser: false });
};

const clearAuthSession = () => {
  if (!isBrowser()) return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  clearActiveRole();
};

export const authService = {
  async login({ email, password }) {
    try {
      const response = await api.post("/users/login", { email, password });

      // Handle success response according to README specs
      if (response.data.success) {
        const { token, user } = response.data.data;
        persistAuthSession(token, user);
        return {
          success: true,
          data: { token, user },
        };
      }

      return response.data;
    } catch (error) {
      // Handle error response
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async register({ email, password, firstName, lastName, ketentuan_agree = false }) {
    try {
      const response = await api.post("/users/register", {
        email,
        password,
        nama_depan: firstName,
        nama_belakang: lastName,
        ketentuan_agree: ketentuan_agree === true,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async getProfile() {
    try {
      const res = await api.get("/users/profile");
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get profile",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async updateProfile(data) {
    try {
      const res = await api.put("/users/profile", data);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async logout() {
    try {
      const res = await api.post("/users/logout");
      clearAuthSession();
      return res.data;
    } catch (error) {
      // Even if API call fails, clear local storage
      clearAuthSession();
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed",
      };
    }
  },

  async forgotPassword(email) {
    try {
      const res = await api.post("/users/forgot-password", { email });
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset email",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const res = await api.post("/users/reset-password", { token, newPassword });
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  getCurrentUser() {
    const user = readStoredUser();
    if (!user) return null;
    const activeRole = readActiveRole();
    return { ...user, role: activeRole || user.role };
  },

  getActiveRole() {
    return readActiveRole();
  },

  setActiveRole(role) {
    persistActiveRole(role);
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  async loginWithGoogle(token) {
    try {
      // Support both idToken and accessToken
      const payload = token.includes(".") && token.split(".").length === 3 ? { idToken: token } : { accessToken: token };
      const response = await api.post("/users/login/google", payload);

      if (response.data.success) {
        const { token, user } = response.data.data;
        persistAuthSession(token, user);

        return {
          success: true,
          data: { token, user },
        };
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Google login failed",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async registerWithGoogle(token, role = "client") {
    try {
      // Support both idToken and accessToken
      const payload = token.includes(".") && token.split(".").length === 3 ? { idToken: token, role } : { accessToken: token, role };
      const response = await api.post("/users/register/google", payload);

      if (response.data.success) {
        const { token, user } = response.data.data;
        persistAuthSession(token, user);

        return {
          success: true,
          data: { token, user },
        };
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Google registration failed",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async createFreelancerProfile(payload) {
    try {
      const res = await api.post("/users/freelancer-profile", payload);
      if (res.data?.success && res.data?.data?.user) {
        const userPayload = {
          ...res.data.data.user,
          role: res.data.data.user.role || "freelancer",
        };
        if (res.data.data.freelancerProfile) {
          userPayload.freelancerProfile = res.data.data.freelancerProfile;
        }
        writeStoredUser(userPayload);
        persistActiveRole("freelancer");
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal membuat profil freelancer",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async switchRole(role) {
    try {
      const res = await api.put("/users/role", { role });
      if (res.data?.success && res.data?.data) {
        if (res.data.data.needsFreelancerRegistration) {
          return res.data;
        }

        const current = readStoredUser() || {};
        const updatedRole = res.data.data.role || role;
        const updatedUser = { ...current, ...res.data.data, role: updatedRole };
        writeStoredUser(updatedUser);
        persistActiveRole(updatedRole, { syncUser: false });
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal mengubah role",
        errors: error.response?.data?.errors || [],
      };
    }
  },
};
