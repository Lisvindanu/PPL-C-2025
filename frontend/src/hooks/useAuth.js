import { useState } from "react";
import { authService } from "../services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(payload);
      if (result.success && result.data) {
        const { token, user } = result.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setLoading(false);
        return user;
      } else {
        setError(result.message || "Login failed");
        setLoading(false);
        throw new Error(result.message || "Login failed");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Login failed");
      setLoading(false);
      throw e;
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(payload);
      if (result.success) {
        setLoading(false);
        return result.data;
      } else {
        setError(result.message || "Registration failed");
        setLoading(false);
        throw new Error(result.message || "Registration failed");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Register failed");
      setLoading(false);
      throw e;
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.getProfile();
      setLoading(false);
      return data;
    } catch (e) {
      setError(e.response?.data?.message || "Failed to get profile");
      setLoading(false);
      throw e;
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result } = await authService.updateProfile(data);
      setLoading(false);
      return result;
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update profile");
      setLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setLoading(false);
    } catch (e) {
      setError(e.response?.data?.message || "Logout failed");
      setLoading(false);
      throw e;
    }
  };

  return { login, register, getProfile, updateProfile, logout, loading, error };
}
