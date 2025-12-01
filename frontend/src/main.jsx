import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvider } from "./components/organisms/ToastProvider";
import "./styles/auth.css";
import "./styles/fonts.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { checkVersion } from "./utils/versionChecker";

// ========================================
// VERSION CHECK: Force reload if version changed
// ========================================
checkVersion(); // This will force reload if needed

// ========================================
// ONE-TIME CLEANUP: Remove old caches
// ========================================
const cleanupOldCaches = () => {
  const oldCacheKeys = [
    'cachedRecommendations_v1',
    'cachedRecommendations_v2',
    'cachedRecommendations_v3',
    'cachedRecommendations_v4',
    'cachedRecommendations_v5'
  ];

  oldCacheKeys.forEach(key => {
    if (sessionStorage.getItem(key)) {
      console.log('[main.jsx] Removing old cache:', key);
      sessionStorage.removeItem(key);
    }
  });

  // Also clean up invalid favorites (not in database)
  const validServiceIds = [
    '30a1cf40-63b5-4849-88d9-1d8bd4911c30',
    '4f81f0ef-146d-4b57-add4-ba285dedecbe',
    '93167661-6d99-406e-b68f-664c01802224',
    '98553fb0-06e1-4e10-8b1c-02cb3b32c6c2',
    'f8ebc809-0762-4091-8477-fc2a131586d6'
  ];

  try {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const cleanedFavorites = favorites.filter(id => validServiceIds.includes(id));

    if (favorites.length !== cleanedFavorites.length) {
      console.log('[main.jsx] Cleaned invalid favorites:', favorites.length, '→', cleanedFavorites.length);
      localStorage.setItem('favorites', JSON.stringify(cleanedFavorites));
    }
  } catch (error) {
    console.error('[main.jsx] Error cleaning favorites:', error);
  }
};

// Run cleanup before app starts
cleanupOldCaches();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 detik
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 1000 * 60 * 5, // 5 menit
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
