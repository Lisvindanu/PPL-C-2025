import api from "../utils/axiosConfig";

export const serviceService = {
  // Get all services with filters
  async getAllServices(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 100, // Get more items for listing
        ...(filters.kategori_id && { kategori_id: filters.kategori_id }),
        ...(filters.harga_min && { harga_min: filters.harga_min }),
        ...(filters.harga_max && { harga_max: filters.harga_max }),
        ...(filters.rating_min && { rating_min: filters.rating_min }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        ...(filters.status && { status: filters.status }),
      };

      if (import.meta.env.DEV) {
        console.log("[serviceService] Fetching services with params:", params);
      }

      const response = await api.get("/services", { params });

      if (import.meta.env.DEV) {
        console.log("[serviceService] Response:", response.data);
      }

      if (response.data.status === "success" || response.data.success) {
        const payload = response.data.data || {};
        const services = Array.isArray(payload.services)
          ? payload.services
          : Array.isArray(payload.items)
          ? payload.items
          : [];
        return {
          success: true,
          services,
          pagination: payload.pagination || {},
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to get services",
        services: [],
        pagination: {},
      };
    } catch (error) {
      console.error("[serviceService] Error fetching services:", error);
      console.error("[serviceService] Error response:", error.response?.data);
      console.error("[serviceService] Error config:", error.config);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to get services",
        services: [],
        pagination: {},
      };
    }
  },

  // Get service by ID
  async getServiceById(serviceId) {
    try {
      if (!serviceId || serviceId === "undefined") {
        return {
          success: false,
          message: "Service ID is required",
          service: null,
        };
      }

      if (import.meta.env.DEV) {
        console.log("[serviceService] Fetching service by ID:", serviceId);
      }

      const response = await api.get(`/services/${serviceId}`);

      if (import.meta.env.DEV) {
        console.log("[serviceService] Service response:", response.data);
      }

      if (response.data.status === "success" || response.data.success) {
        return {
          success: true,
          service: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data.message || "Service not found",
        service: null,
      };
    } catch (error) {
      console.error("[serviceService] Error fetching service:", error);
      console.error("[serviceService] Error response:", error.response?.data);
      console.error("[serviceService] Error config:", error.config);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to get service",
        service: null,
      };
    }
  },

  // Get service by slug
  async getServiceBySlug(slug) {
    try {
      if (!slug || slug === "undefined") {
        return {
          success: false,
          message: "Slug is required",
          service: null,
        };
      }

      if (import.meta.env.DEV) {
        console.log("[serviceService] Fetching service by slug:", slug);
      }

      const response = await api.get(`/services/slug/${slug}`);

      if (response.data.status === "success" || response.data.success) {
        return {
          success: true,
          service: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data.message || "Service not found",
        service: null,
      };
    } catch (error) {
      console.error("[serviceService] Error fetching service by slug:", error);
      console.error("[serviceService] Error response:", error.response?.data);
      console.error("[serviceService] Error config:", error.config);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to get service by slug",
        service: null,
      };
    }
  },

  // Get all categories
  async getCategories() {
    try {
      if (import.meta.env.DEV) {
        console.log("[serviceService] Fetching categories...");
      }
      const response = await api.get("/kategori");

      if (import.meta.env.DEV) {
        console.log("[serviceService] Categories response:", response.data);
      }

      if (response.data.success || response.data.status === "success") {
        return {
          success: true,
          categories: response.data.data || [],
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to get categories",
        categories: [],
      };
    } catch (error) {
      console.error("[serviceService] Error fetching categories:", error);
      console.error("[serviceService] Error response:", error.response?.data);
      console.error("[serviceService] Error config:", error.config);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to get categories",
        categories: [],
      };
    }
  },

  // Search services
  async searchServices(query, filters = {}) {
    try {
      const params = {
        q: query,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.kategori_id && { kategori_id: filters.kategori_id }),
      };

      const response = await api.get("/services/search", { params });

      if (response.data.status === "success" || response.data.success) {
        const payload = response.data.data || {};
        const services = Array.isArray(payload.services)
          ? payload.services
          : Array.isArray(payload.items)
          ? payload.items
          : [];
        return {
          success: true,
          services,
          pagination: payload.pagination || {},
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to search services",
        services: [],
        pagination: {},
      };
    } catch (error) {
      console.error("Error searching services:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to search services",
        services: [],
        pagination: {},
      };
    }
  },

  // =========================================================
  // List layanan milik freelancer (semua status)
  // =========================================================
  async getMyServices(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 6,
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      };

      if (import.meta.env.DEV) {
        console.log(
          "[serviceService] Fetching MY services with params:",
          params
        );
      }

      const response = await api.get("/services/my", { params });

      if (import.meta.env.DEV) {
        console.log("[serviceService] /services/my Response:", response.data);
      }

      if (response.data.status === "success" || response.data.success) {
        const payload = response.data.data || {};
        const services = Array.isArray(payload.services)
          ? payload.services
          : Array.isArray(payload.items)
          ? payload.items
          : [];
        return {
          success: true,
          services,
          pagination: payload.pagination || {},
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to get my services",
        services: [],
        pagination: {},
      };
    } catch (error) {
      console.error("[serviceService] Error fetching MY services:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to get my services",
        services: [],
        pagination: {},
      };
    }
  },

  // =========================================================
  // Hapus layanan milik freelancer
  // =========================================================
  async deleteMyService(serviceId) {
    try {
      if (!serviceId) {
        return { success: false, message: "Service ID is required" };
      }

      if (import.meta.env.DEV) {
        console.log("[serviceService] Deleting service:", serviceId);
      }

      const response = await api.delete(`/services/${serviceId}`);

      if (import.meta.env.DEV) {
        console.log("[serviceService] Delete response:", response.data);
      }

      if (response.data.status === "success" || response.data.success) {
        return { success: true };
      }

      return {
        success: false,
        message: response.data.message || "Failed to delete service",
      };
    } catch (error) {
      console.error("[serviceService] Error deleting service:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete service",
      };
    }
  },
};
