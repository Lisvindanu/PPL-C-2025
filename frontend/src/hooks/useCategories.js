// src/hooks/useCategories.js
import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        setCategoriesError("");
        const res = await api.get("/kategori");
        const data = res?.data?.data || [];
        if (!ignore) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
        if (!ignore) {
          setCategoriesError(
            err?.response?.data?.message ||
              err?.message ||
              "Gagal memuat kategori"
          );
        }
      } finally {
        if (!ignore) {
          setLoadingCategories(false);
        }
      }
    }

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  return { categories, loadingCategories, categoriesError };
}
