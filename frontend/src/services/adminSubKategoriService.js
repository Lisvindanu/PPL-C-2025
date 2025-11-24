// frontend/src/services/adminSubKategoriService.js

import api from '../utils/axiosConfig'; 
import { adminKategoriService } from './adminKategoriService'; 

const ENDPOINT_PREFIX = '/admin/sub-kategori';

export const adminSubKategoriService = {
    getAll: async (params) => {
        try {
            const response = await api.get(ENDPOINT_PREFIX, { params });
            return { success: true, data: response.data.data, message: 'Data sub kategori berhasil dimuat' };
        } catch (error) {
            console.error('Error fetching sub categories:', error);
            throw error; 
        }
    },

    getAllCategoriesSimple: async () => {
        try {
            const response = await adminKategoriService.getAll({ 
                select: 'id,nama', 
                is_active: 1, 
                no_paginate: true 
            });
            return response;
        } catch (error) {
            console.error('Error fetching parent categories:', error);
            return { success: false, data: [], message: 'Gagal memuat kategori induk' };
        }
    },

    createSubKategori: async (data) => {
        // Data yang dikirim: { nama, id_kategori, deskripsi } -> Match backend
        const response = await api.post(ENDPOINT_PREFIX, data);
        return response.data;
    },

    updateSubKategori: async (id, data) => {
        const response = await api.put(`${ENDPOINT_PREFIX}/${id}`, data);
        return response.data;
    },
    
    deleteSubKategori: async (id) => {
        const response = await api.delete(`${ENDPOINT_PREFIX}/${id}`);
        return response.data;
    },
    
    toggleStatus: async (id, isActive) => {
        const response = await api.patch(`${ENDPOINT_PREFIX}/${id}/toggle-status`, { is_active: isActive });
        return response.data;
    }
};