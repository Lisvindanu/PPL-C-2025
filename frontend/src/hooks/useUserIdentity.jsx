import { useEffect, useMemo, useState } from "react";

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
            const res = await fetch("http://localhost:5000/api/users/profile", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const result = await res.json();
              if (!cancelled && result?.success && result?.data) {
                setState({
                  firstName: result.data.nama_depan || "",
                  lastName: result.data.nama_belakang || "",
                  email: result.data.email || "",
                  avatarUrl:
                    result.data.avatar_url ||
                    result.data.avatar ||
                    "https://i.pravatar.cc/96",
                  loading: false,
                });
                return;
              }
            }
          } catch {}
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
