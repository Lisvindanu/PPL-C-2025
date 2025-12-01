import { useEffect, useMemo, useState } from "react";
import api from "../utils/axiosConfig";

export default function useUserIdentity() {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: "",
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token) {
          try {
            const response = await api.get("/users/profile");
            if (response.data?.success && response.data?.data && !cancelled) {
              setState({
                firstName: response.data.data.nama_depan || "",
                lastName: response.data.data.nama_belakang || "",
                email: response.data.data.email || "",
                avatarUrl:
                  response.data.data.avatar_url ||
                  response.data.data.avatar ||
                  "https://i.pravatar.cc/96",
                loading: false,
              });
              return;
            }
          } catch (error) {
            // Silent fail - endpoint might be unavailable
            // Fall back to localStorage user data below
            if (error.response?.status !== 404) {
              console.warn('[useUserIdentity] Profile fetch failed:', error.message);
            }
          }
        }

        const user =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null;

        setState({
          firstName: user?.nama_depan || "",
          lastName: user?.nama_belakang || "",
          email: user?.email || "",
          avatarUrl:
            user?.avatar_url || user?.avatar || "https://i.pravatar.cc/96",
          loading: false,
        });
      } catch {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fullName = useMemo(() => {
    const f = (state.firstName || "").trim();
    const l = (state.lastName || "").trim();
    return [f, l].filter(Boolean).join(" ") || "User";
  }, [state.firstName, state.lastName]);

  return {
    loading: state.loading,
    fullName,
    email: state.email,
    avatarUrl: state.avatarUrl,
  };
}
