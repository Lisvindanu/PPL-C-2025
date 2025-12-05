const SequelizeFavoriteRepository = require('../../infrastructure/repositories/SequelizeFavoriteRepository');
const GetFavorites = require('../../application/use-cases/GetFavorites');
const AddFavorite = require('../../application/use-cases/AddFavorite');
const RemoveFavorite = require('../../application/use-cases/RemoveFavorite');
const CheckFavorite = require('../../application/use-cases/CheckFavorite');

class FavoriteController {
  constructor() {
    const favoriteRepository = new SequelizeFavoriteRepository();

    this.getFavoritesUseCase = new GetFavorites(favoriteRepository);
    this.addFavoriteUseCase = new AddFavorite(favoriteRepository);
    this.removeFavoriteUseCase = new RemoveFavorite(favoriteRepository);
    this.checkFavoriteUseCase = new CheckFavorite(favoriteRepository);
  }

  /**
   * Get all favorites for current user
   * GET /api/favorites
   */
  getFavorites = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      // Check if user is client
      if (req.user.role !== 'client') {
        const err = new Error('Fitur favorit hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const result = await this.getFavoritesUseCase.execute(userId);

      if (!result.success) {
        const err = new Error(result.message);
        err.statusCode = 400;
        throw err;
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Add a favorite
   * POST /api/favorites
   * Body: { layanan_id: string }
   */
  addFavorite = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      // Check if user is client
      if (req.user.role !== 'client') {
        const err = new Error('Fitur favorit hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const { layanan_id } = req.body;
      if (!layanan_id) {
        const err = new Error('layanan_id is required');
        err.statusCode = 400;
        throw err;
      }

      const result = await this.addFavoriteUseCase.execute(userId, layanan_id);

      if (!result.success) {
        const err = new Error(result.message);
        err.statusCode = 400;
        throw err;
      }

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Remove a favorite
   * DELETE /api/favorites/:layananId
   */
  removeFavorite = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      // Check if user is client
      if (req.user.role !== 'client') {
        const err = new Error('Fitur favorit hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const { layananId } = req.params;
      if (!layananId) {
        const err = new Error('layananId is required');
        err.statusCode = 400;
        throw err;
      }

      const result = await this.removeFavoriteUseCase.execute(userId, layananId);

      if (!result.success) {
        const err = new Error(result.message);
        err.statusCode = 400;
        throw err;
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Check if a service is favorited
   * GET /api/favorites/check/:layananId
   */
  checkFavorite = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      // Check if user is client
      if (req.user.role !== 'client') {
        const err = new Error('Fitur favorit hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const { layananId } = req.params;
      if (!layananId) {
        const err = new Error('layananId is required');
        err.statusCode = 400;
        throw err;
      }

      const result = await this.checkFavoriteUseCase.execute(userId, layananId);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = FavoriteController;
