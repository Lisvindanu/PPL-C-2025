import api from '../utils/axiosConfig'

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
        ...(filters.status && { status: filters.status })
      }

      // Only log in development
      if (import.meta.env.DEV) {
        console.log('[serviceService] Fetching services with params:', params)
      }
      const response = await api.get('/services', { params })
      if (import.meta.env.DEV) {
        console.log('[serviceService] Response:', response.data)
      }
      
      if (response.data.status === 'success') {
        return {
          success: true,
          services: response.data.data.services || [],
          pagination: response.data.data.pagination || {}
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to get services',
        services: [],
        pagination: {}
      }
    } catch (error) {
      console.error('[serviceService] Error fetching services:', error)
      console.error('[serviceService] Error response:', error.response?.data)
      console.error('[serviceService] Error config:', error.config)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get services',
        services: [],
        pagination: {}
      }
    }
  },

  // Get service by ID
  async getServiceById(serviceId) {
    try {
      // Validate serviceId
      if (!serviceId || serviceId === 'undefined') {
        return {
          success: false,
          message: 'Service ID is required',
          service: null
        }
      }

      // Only log in development
      if (import.meta.env.DEV) {
        console.log('[serviceService] Fetching service by ID:', serviceId)
      }
      const response = await api.get(`/services/${serviceId}`)
      if (import.meta.env.DEV) {
        console.log('[serviceService] Service response:', response.data)
      }
      
      if (response.data.status === 'success') {
        return {
          success: true,
          service: response.data.data
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Service not found',
        service: null
      }
    } catch (error) {
      console.error('[serviceService] Error fetching service:', error)
      console.error('[serviceService] Error response:', error.response?.data)
      console.error('[serviceService] Error config:', error.config)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get service',
        service: null
      }
    }
  },

  // Get service by slug
  async getServiceBySlug(slug) {
    try {
      // Validate slug
      if (!slug || slug === 'undefined') {
        return {
          success: false,
          message: 'Slug is required',
          service: null
        }
      }

      // Only log in development
      if (import.meta.env.DEV) {
        console.log('[serviceService] Fetching service by slug:', slug)
      }
      
      // Try to fetch by slug endpoint first
      try {
        const response = await api.get(`/services/slug/${slug}`)
        if (import.meta.env.DEV) {
          console.log('[serviceService] Service by slug response:', response.data)
        }
        
        if (response.data.status === 'success') {
          return {
            success: true,
            service: response.data.data
          }
        }
      } catch (slugError) {
        // If slug endpoint not implemented (501), fallback to fetch all and filter
        if (slugError.response?.status === 501 || slugError.response?.status === 404) {
          if (import.meta.env.DEV) {
            console.log('[serviceService] Slug endpoint not available (501), fetching all services and filtering by slug')
          }
          
          // Fetch all services and filter by slug
          let allServices = []
          let currentPage = 1
          let hasMore = true
          const limit = 100
          const maxPages = 10

          while (hasMore && currentPage <= maxPages) {
            const allServicesResult = await this.getAllServices({ 
              page: currentPage, 
              limit: limit,
              status: 'aktif'
            })
            
            if (allServicesResult.success && allServicesResult.services) {
              allServices = [...allServices, ...allServicesResult.services]
              
              // Check if we found the service
              const foundService = allServices.find(s => s.slug === slug)
              if (foundService) {
                if (import.meta.env.DEV) {
                  console.log('[serviceService] Service found by slug, fetching full detail by ID:', foundService.id)
                }
                // Fetch full detail by ID
                return await this.getServiceById(foundService.id)
              }
              
              // Check if there are more pages
              const pagination = allServicesResult.pagination || {}
              if (pagination.totalPages && currentPage < pagination.totalPages) {
                currentPage++
              } else {
                hasMore = false
              }
            } else {
              hasMore = false
            }
          }
          
          // If we've checked all pages and didn't find the service
          if (import.meta.env.DEV) {
            console.log('[serviceService] Service not found by slug after checking all pages')
          }
          return {
            success: false,
            message: 'Service not found',
            service: null
          }
        }
        
        // If it's not a 501 or 404, throw the error
        throw slugError
      }
      
      return {
        success: false,
        message: 'Service not found',
        service: null
      }
    } catch (error) {
      // Only log if it's not a handled 501 error
      if (error.response?.status !== 501) {
        console.error('[serviceService] Error fetching service by slug:', error)
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get service',
        service: null
      }
    }
  },

  // Get all categories
  async getCategories() {
    try {
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('[serviceService] Fetching categories...')
      }
      const response = await api.get('/kategori')
      if (import.meta.env.DEV) {
        console.log('[serviceService] Categories response:', response.data)
      }
      
      if (response.data.success) {
        return {
          success: true,
          categories: response.data.data || []
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to get categories',
        categories: []
      }
    } catch (error) {
      console.error('[serviceService] Error fetching categories:', error)
      console.error('[serviceService] Error response:', error.response?.data)
      console.error('[serviceService] Error config:', error.config)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get categories',
        categories: []
      }
    }
  },

  // Search services
  async searchServices(query, filters = {}) {
    try {
      const params = {
        q: query,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.kategori_id && { kategori_id: filters.kategori_id })
      }

      const response = await api.get('/services/search', { params })
      
      if (response.data.status === 'success') {
        return {
          success: true,
          services: response.data.data.services || [],
          pagination: response.data.data.pagination || {}
        }
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to search services',
        services: [],
        pagination: {}
      }
    } catch (error) {
      console.error('Error searching services:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search services',
        services: [],
        pagination: {}
      }
    }
  }
}
