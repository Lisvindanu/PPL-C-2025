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
            const userId = req.user?.user_id || req.body.userId;
            const { serviceId } = req.params;

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

            const result = await this.manageFavoritesUseCase.addFavorite(
                dto.userId,
                dto.serviceId,
                dto.notes
            );

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error('FavoriteController.addFavorite Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * DELETE /api/recommendations/favorites/:serviceId
     * Remove service from favorites
     */
    async removeFavorite(req, res) {
        try {
            const userId = req.user?.user_id || req.query.userId;
            const { serviceId } = req.params;

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
            const userId = req.user?.user_id || req.query.userId;

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