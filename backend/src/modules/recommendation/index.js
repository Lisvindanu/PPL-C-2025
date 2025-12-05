const dependencyContainer = require('./dependencies');
const initializeRoutes = require('./presentation/routes/recommendationRoutes');
const cron = require('node-cron');

/**
 * Setup cron job untuk update recommendation cache
 */
const setupRecommendationCronJobs = (recommendationRepository) => {
    console.log('⏰ Setting up recommendation cron jobs...');

    // Update recommendation cache every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('🔄 [CRON] Updating recommendation cache...');
        try {
            const activeUsers = await recommendationRepository.getActiveUsers(30);

            console.log(`📊 [CRON] Found ${activeUsers.length} active users`);

            let successCount = 0;
            for (const user of activeUsers) {
                try {
                    await recommendationRepository.getRecommendationsForUser(user.id, {
                        limit: 20,
                        refresh: true
                    });
                    successCount++;
                } catch (err) {
                    console.error(`❌ [CRON] Failed for user ${user.id}:`, err.message);
                }
            }

            console.log(`✅ [CRON] Cache updated for ${successCount}/${activeUsers.length} users`);
        } catch (error) {
            console.error('❌ [CRON] Cache update failed:', error);
        }
    });

    // Clean up old interactions every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('🧹 [CRON] Cleaning up old interactions...');
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 90);

            const deleted = await recommendationRepository.deleteOldInteractions(cutoffDate);
            console.log(`✅ [CRON] Cleaned ${deleted} old interactions`);
        } catch (error) {
            console.error('❌ [CRON] Cleanup failed:', error);
        }
    });

    console.log('✅ Cron jobs configured successfully');
};

/**
 * Initialize Recommendation Module
 * @returns {Object} Router dan controllers untuk digunakan oleh aplikasi utama
 */
const initializeRecommendationModule = () => {
    console.log('🔄 Initializing Recommendation Module...');

    const recommendationController = dependencyContainer.getRecommendationController();
    const favoriteController = dependencyContainer.getFavoriteController();
    const recommendationRepository = dependencyContainer.getRecommendationRepository();

    console.log('✅ Controllers initialized');

    const router = initializeRoutes(recommendationController, favoriteController);

    console.log('✅ Routes initialized');

    setupRecommendationCronJobs(recommendationRepository);

    console.log('✅ Recommendation Module ready');

    return {
        router,
        recommendationController,
        favoriteController,
        recommendationRepository,
        favoriteRepository: dependencyContainer.getFavoriteRepository()
    };
};

module.exports = initializeRecommendationModule;