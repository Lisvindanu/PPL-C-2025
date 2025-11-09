const dependencyContainer = require('./dependencies');
const initializeRoutes = require('./presentation/routes/recommendationRoutes');

/**
 * Initialize Recommendation Module
 * @returns {Object} Router dan controllers untuk digunakan oleh aplikasi utama
 */
const initializeRecommendationModule = () => {
    console.log('🔄 Initializing Recommendation Module...');

    // Get controllers from dependency container
    const recommendationController = dependencyContainer.getRecommendationController();
    const favoriteController = dependencyContainer.getFavoriteController();

    console.log('✅ Controllers initialized');

    // Initialize routes with controllers
    const router = initializeRoutes(recommendationController, favoriteController);

    console.log('✅ Routes initialized');
    console.log('✅ Recommendation Module ready');

    return {
        router,
        recommendationController,
        favoriteController,
        // Export repositories if needed by other modules
        recommendationRepository: dependencyContainer.getRecommendationRepository(),
        favoriteRepository: dependencyContainer.getFavoriteRepository()
    };
};

module.exports = initializeRecommendationModule;