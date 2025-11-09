// Dependency Injection Container untuk Modul Recommendation

// Domain Services
const RecommendationService = require('./domain/services/RecommendationService');

// Repositories
const RecommendationRepositoryImpl = require('./infrastructure/repositories/RecommendationRepositoryImpl');
const FavoriteRepositoryImpl = require('./infrastructure/repositories/FavoriteRepositoryImpl');

// Use Cases
const GetRecommendationsUseCase = require('./application/use-cases/GetRecommendationsUseCase');
const GetSimilarServicesUseCase = require('./application/use-cases/GetSimilarServicesUseCase');
const GetPopularServicesUseCase = require('./application/use-cases/GetPopularServicesUseCase');
const ManageFavoritesUseCase = require('./application/use-cases/ManageFavoritesUseCase');
const TrackInteractionUseCase = require('./application/use-cases/TrackInteractionUseCase');

// Controllers
const RecommendationController = require('./presentation/controllers/RecommendationController');
const FavoriteController = require('./presentation/controllers/FavoriteController');

/**
 * Initialize and wire up all dependencies
 */
class DependencyContainer {
    constructor() {
        this._initializeRepositories();
        this._initializeServices();
        this._initializeUseCases();
        this._initializeControllers();
    }

    _initializeRepositories() {
        // Infrastructure repositories (with dummy data for now)
        this.recommendationRepository = new RecommendationRepositoryImpl();
        this.favoriteRepository = new FavoriteRepositoryImpl();
    }

    _initializeServices() {
        // Domain services
        this.recommendationService = new RecommendationService();
    }

    _initializeUseCases() {
        // Application use cases
        this.getRecommendationsUseCase = new GetRecommendationsUseCase(
            this.recommendationRepository,
            this.recommendationService
        );

        this.getSimilarServicesUseCase = new GetSimilarServicesUseCase(
            this.recommendationRepository,
            this.recommendationService
        );

        this.getPopularServicesUseCase = new GetPopularServicesUseCase(
            this.recommendationRepository,
            this.recommendationService
        );

        this.manageFavoritesUseCase = new ManageFavoritesUseCase(
            this.favoriteRepository,
            this.recommendationRepository
        );

        this.trackInteractionUseCase = new TrackInteractionUseCase(
            this.recommendationRepository
        );
    }

    _initializeControllers() {
        // Presentation controllers
        this.recommendationController = new RecommendationController(
            this.getRecommendationsUseCase,
            this.getSimilarServicesUseCase,
            this.getPopularServicesUseCase,
            this.trackInteractionUseCase
        );

        this.favoriteController = new FavoriteController(
            this.manageFavoritesUseCase
        );
    }

    // Getters for external access
    getRecommendationController() {
        return this.recommendationController;
    }

    getFavoriteController() {
        return this.favoriteController;
    }

    getRecommendationRepository() {
        return this.recommendationRepository;
    }

    getFavoriteRepository() {
        return this.favoriteRepository;
    }
}

// Export singleton instance
const container = new DependencyContainer();

module.exports = container;