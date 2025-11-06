const IFavoriteRepository = require('../../domain/repositories/IFavoriteRepository');
const Favorite = require('../../domain/entities/Favorite');

/**
 * Implementation of IFavoriteRepository using Sequelize
 * Menggunakan tabel 'favorit' yang sudah ada
 */
class FavoriteRepositoryImpl extends IFavoriteRepository {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.FavoriteModel = require('../models/Favorite');
    }

    async addFavorite(userId, serviceId, notes = '') {
        try {
            const favoriteData = await this.FavoriteModel.create({
                user_id: userId,
                layanan_id: serviceId,
                created_at: new Date()
            });

            return new Favorite({
                id: favoriteData.id,
                userId: favoriteData.user_id,
                serviceId: favoriteData.layanan_id,
                notes: notes, // notes disimpan di entity tapi tidak di DB (sesuai struktur tabel)
                addedAt: favoriteData.created_at
            });
        } catch (error) {
            console.error('FavoriteRepository.addFavorite Error:', error);

            // Handle duplicate favorite error
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Service already in favorites');
            }

            throw new Error('Failed to add favorite: ' + error.message);
        }
    }

    async removeFavorite(userId, serviceId) {
        try {
            const deleted = await this.FavoriteModel.destroy({
                where: {
                    user_id: userId,
                    layanan_id: serviceId
                }
            });

            return deleted > 0;
        } catch (error) {
            console.error('FavoriteRepository.removeFavorite Error:', error);
            throw new Error('Failed to remove favorite: ' + error.message);
        }
    }

    async getFavorites(userId) {
        try {
            const favorites = await this.FavoriteModel.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: this.sequelize.models.Layanan,
                        as: 'layanan',
                        attributes: ['id', 'nama_layanan', 'deskripsi', 'harga', 'kategori_id', 'sub_kategori_id']
                    }
                ]
            });

            return favorites.map(fav => new Favorite({
                id: fav.id,
                userId: fav.user_id,
                serviceId: fav.layanan_id,
                notes: '', // Tidak ada notes di DB
                addedAt: fav.created_at
            }));
        } catch (error) {
            console.error('FavoriteRepository.getFavorites Error:', error);
            throw new Error('Failed to get favorites: ' + error.message);
        }
    }

    async isFavorite(userId, serviceId) {
        try {
            const favorite = await this.FavoriteModel.findOne({
                where: {
                    user_id: userId,
                    layanan_id: serviceId
                }
            });

            return favorite !== null;
        } catch (error) {
            console.error('FavoriteRepository.isFavorite Error:', error);
            throw new Error('Failed to check favorite: ' + error.message);
        }
    }

    async getFavoriteCount(serviceId) {
        try {
            const count = await this.FavoriteModel.count({
                where: { layanan_id: serviceId }
            });

            return count;
        } catch (error) {
            console.error('FavoriteRepository.getFavoriteCount Error:', error);
            throw new Error('Failed to get favorite count: ' + error.message);
        }
    }
}

module.exports = FavoriteRepositoryImpl;