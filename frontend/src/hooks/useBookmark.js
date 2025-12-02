import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { bookmarkService } from "../services/bookmarkService";

/**
 * Generic hook untuk mengelola status bookmark sebuah layanan.
 * Dipakai di ServiceCardItem, OrderCard, dll.
 */
export function useBookmark({
  serviceId,
  initialIsBookmarked = false,
  onChange,
} = {}) {
  const user = authService.getCurrentUser();
  const isClient = user?.role === "client";

  const [isBookmarked, setIsBookmarked] = useState(Boolean(initialIsBookmarked));
  const [isLoading, setIsLoading] = useState(false);

  // Sinkronkan state jika initialIsBookmarked berubah (mis. dari page yang sudah tahu)
  useEffect(() => {
    setIsBookmarked(Boolean(initialIsBookmarked));
  }, [initialIsBookmarked, serviceId]);

  // Hydrate dari API agar state tetap benar saat refresh / direct visit
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!user || !isClient || !serviceId) return;

      try {
        const res = await bookmarkService.isBookmarked(serviceId);
        if (cancelled) return;
        if (res?.success && typeof res.data?.isBookmarked === "boolean") {
          setIsBookmarked(res.data.isBookmarked);
          onChange?.(res.data.isBookmarked);
        }
      } catch {
        // Biarkan state existing kalau gagal
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [user, isClient, serviceId, onChange]);

  const addBookmark = async () => {
    if (!user || !isClient || !serviceId) {
      return { success: false };
    }

    setIsLoading(true);
    let next = true;
    setIsBookmarked(next);
    onChange?.(next);

    try {
      const res = await bookmarkService.addBookmark(serviceId);
      if (!res?.success) {
        next = false;
        setIsBookmarked(next);
        onChange?.(next);
      }
      return res;
    } catch (error) {
      console.error("[useBookmark] addBookmark error:", error);
      next = false;
      setIsBookmarked(next);
      onChange?.(next);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmark = async () => {
    if (!user || !isClient || !serviceId) {
      return { success: false };
    }

    setIsLoading(true);
    let next = false;
    setIsBookmarked(next);
    onChange?.(next);

    try {
      const res = await bookmarkService.removeBookmark(serviceId);
      if (!res?.success) {
        next = true;
        setIsBookmarked(next);
        onChange?.(next);
      }
      return res;
    } catch (error) {
      console.error("[useBookmark] removeBookmark error:", error);
      next = true;
      setIsBookmarked(next);
      onChange?.(next);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async (toSaved) =>
    toSaved ? addBookmark() : removeBookmark();

  return {
    isBookmarked,
    isLoading,
    isClient,
    addBookmark,
    removeBookmark,
    toggleBookmark,
  };
}
