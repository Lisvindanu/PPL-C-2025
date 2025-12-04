import api from '../utils/axiosConfig'

export const adminKategoriService = {
  async getAll(params = {}) {
    const response = await api.get('/admin/kategori', { params })
    return response.data
  },

  async createKategori(payload) {
    const response = await api.post('/admin/kategori', payload)
    return response.data
  },

  async updateKategori(id, payload) {
    const response = await api.put(`/admin/kategori/${id}`, payload)
    return response.data
  },

  async toggleStatus(id, is_active) {
    const response = await api.patch(`/admin/kategori/${id}/toggle-status`, { is_active })
    return response.data
  },

  async deleteKategori(id) {
    const response = await api.delete(`/admin/kategori/${id}`)
    return response.data
  },

  // Sub-kategori list for a kategori
  async getSubKategoriByKategori(kategoriId) {
    const response = await api.get('/sub-kategori', { params: { id_kategori: kategoriId } })
    return response.data
  }
}
