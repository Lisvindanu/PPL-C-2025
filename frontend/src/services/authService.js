import api from "../utils/axiosConfig";

export const authService = {
  async login({ email, password }) {
    try {
      const response = await api.post("/users/login", { email, password });

      // Handle success response according to README specs
      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return res.data;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  async createFreelancerProfile(data) {
    try {
      const res = await api.post("/users/freelancer-profile", data);
      // Update user data in localStorage if profile creation is successful
      if (res.data.success && res.data.data?.user) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...res.data.data.user };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create freelancer profile",
        errors: error.response?.data?.errors || [],
      };
    }
  },

  async switchRole(newRole) {
    try {
      const res = await api.put("/users/role", { role: newRole });
      // Update user data in localStorage if role switch is successful
      if (res.data.success && res.data.data) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, role: res.data.data.role };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to switch role",
        errors: error.response?.data?.errors || [],
      };
    }
  },
};
