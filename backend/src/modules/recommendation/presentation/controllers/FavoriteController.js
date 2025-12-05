const FavoriteRepositoryImpl = require('../../infrastructure/repositories/FavoriteRepositoryImpl');
const RecommendationRepositoryImpl = require('../../infrastructure/repositories/RecommendationRepositoryImpl');
const ManageFavoritesUseCase = require('../../application/use-cases/ManageFavoritesUseCase');

const {
    AddFavoriteDTO,
    RemoveFavoriteDTO,
    GetFavoritesDTO
} = require('../../application/dtos/RecommendationDTOs');

/**
 * Controller untuk menangani request terkait Favorites
 * Compatible dengan pattern instantiasi di server.js
 */
class FavoriteController {
    constructor(sequelize) {
        // Initialize dependencies
        this.sequelize = sequelize;
        this.favoriteRepository = new FavoriteRepositoryImpl(sequelize);
        this.recommendationRepository = new RecommendationRepositoryImpl(sequelize);

        // Initialize use case
        this.manageFavoritesUseCase = new ManageFavoritesUseCase(
            this.favoriteRepository,
            this.recommendationRepository
        );
    }

    /**
     * POST /api/recommendations/favorites/:serviceId
     * Add service to favorites
     */
    async addFavorite(req, res) {
        try {
            const userId = req.user?.userId || req.body.userId;
            let { serviceId } = req.params;

            console.log('addFavorite - Input:', { userId, serviceId });

            // VALIDASI userId
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User ID is required. Please login first.'
                });
            }

            // VALIDASI serviceId
            if (!serviceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Service ID is required'
                });
            }

            // Trim whitespace
            serviceId = serviceId.trim();

            // VALIDASI format UUID
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(serviceId)) {
                console.warn(`Invalid serviceId format: ${serviceId}`);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid service ID format. Must be a valid UUID, not a number or string literal.'
                });
            }

            // VALIDASI: Cek apakah layanan exists di database
            try {
                const Layanan = this.sequelize.models.Layanan;
                const layananExists = await Layanan.findByPk(serviceId);

                if (!layananExists) {
                    console.warn(`Service ID ${serviceId} not found in database`);
                    return res.status(404).json({
                        success: false,
                        message: 'Layanan tidak ditemukan di database'
                    });
                }
            } catch (dbError) {
                console.error('Error checking layanan existence:', dbError);
                return res.status(500).json({
                    success: false,
                    message: 'Error validating service ID'
                });
            }

            console.log('addFavorite - After validation:', { userId, serviceId });

            // Create DTO setelah validasi
            const dto = new AddFavoriteDTO({
                userId,
                serviceId,
                notes: req.body.notes || ''
            });

            // Validate DTO
            const validation = dto.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            // Call use case
            const result = await this.manageFavoritesUseCase.addFavorite(
                dto.userId,
                dto.serviceId,
                dto.notes
            );

            if (!result.success) {
                // Handle specific error messages
                if (result.error?.includes('sudah ada')) {
                    return res.status(400).json({
                        success: false,
                        message: 'Layanan sudah ada di favorit'
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            return res.status(201).json({
                success: true,
                message: result.message || 'Layanan berhasil ditambahkan ke favorit',
                data: result.data
            });
        } catch (error) {
            console.error('FavoriteController.addFavorite Error:', error);
            console.error('Error stack:', error.stack);

            // Handle specific Sequelize errors
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid service ID or user ID - Foreign key constraint failed'
                });
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    success: false,
                    message: 'Layanan sudah ada di favorit'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
            });
        }
    }

    /**
     * DELETE /api/recommendations/favorites/:serviceId
     * Remove service from favorites
     */
    async removeFavorite(req, res) {
        try {
            const userId = req.user?.userId || req.query.userId;
            let { serviceId } = req.params;

            // VALIDASI format UUID untuk removeFavorite juga
            if (serviceId) {
                serviceId = serviceId.trim();
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

                if (!uuidRegex.test(serviceId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid service ID format'
                    });
                }
            }

            const dto = new RemoveFavoriteDTO({
                userId,
                serviceId
            });

            // Validate DTO
            const validation = dto.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const result = await this.manageFavoritesUseCase.removeFavorite(
                dto.userId,
                dto.serviceId
            );

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('FavoriteController.removeFavorite Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * GET /api/recommendations/favorites
     * Get user's favorite services
     */
    async getFavorites(req, res) {
        try {
            const userId = req.user?.userId || req.query.userId;

            const dto = new GetFavoritesDTO({ userId });

            // Validate DTO
            const validation = dto.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const result = await this.manageFavoritesUseCase.getFavorites(dto.userId);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Favorites retrieved successfully',
                data: result.data,
                metadata: result.metadata
            });
        } catch (error) {
            console.error('FavoriteController.getFavorites Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = FavoriteController;