const SequelizeFavoriteRepository = require('../../../favorite/infrastructure/repositories/SequelizeFavoriteRepository');
const GetFavorites = require('../../../favorite/application/use-cases/GetFavorites');
const AddFavorite = require('../../../favorite/application/use-cases/AddFavorite');
const RemoveFavorite = require('../../../favorite/application/use-cases/RemoveFavorite');
const CheckFavorite = require('../../../favorite/application/use-cases/CheckFavorite');

/**
 * Bookmark Controller
 * Catatan: Secara storage, bookmark menggunakan tabel/logic yang sama dengan favorites.
 * Perbedaannya hanya pada penamaan endpoint dan konteks penggunaan di FE.
 */
class BookmarkController {
  constructor() {
    const favoriteRepository = new SequelizeFavoriteRepository();

    this.getBookmarksUseCase = new GetFavorites(favoriteRepository);
    this.addBookmarkUseCase = new AddFavorite(favoriteRepository);
    this.removeBookmarkUseCase = new RemoveFavorite(favoriteRepository);
    this.checkBookmarkUseCase = new CheckFavorite(favoriteRepository);
  }

  /**
   * Get all bookmarks for current user
   * GET /api/bookmarks
   */
  getBookmarks = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      // Hanya client yang bisa menggunakan bookmark
      if (req.user.role !== 'client') {
        const err = new Error('Fitur bookmark hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const result = await this.getBookmarksUseCase.execute(userId);

      if (!result.success) {
        const err = new Error(result.message);
        err.statusCode = 400;
        throw err;
      }

      // Ubah key untuk konsistensi penamaan (optional)
      const data = Array.isArray(result.data?.favorites) ? result.data.favorites : [];
      res.json({
        success: true,
        message: 'Bookmarks retrieved successfully',
        data,
        total: data.length
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Add a bookmark
   * POST /api/bookmarks
   * Body: { layanan_id: string }
   */
  addBookmark = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      if (req.user.role !== 'client') {
        const err = new Error('Fitur bookmark hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const { layanan_id } = req.body;
      if (!layanan_id) {
        const err = new Error('layanan_id is required');
        err.statusCode = 400;
        throw err;
      }

      const result = await this.addBookmarkUseCase.execute(userId, layanan_id);

      if (!result.success) {
        const err = new Error(result.message);
        err.statusCode = 400;
        throw err;
      }

      res.status(201).json({
        success: true,
        message: 'Layanan berhasil ditambahkan ke bookmark',
        data: result.data
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Remove a bookmark
   * DELETE /api/bookmarks/:layananId
   */
  removeBookmark = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      if (req.user.role !== 'client') {
        const err = new Error('Fitur bookmark hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const { layananId } = req.params;
      if (!layananId) {
        const err = new Error('layananId is required');
        err.statusCode = 400;
        throw err;
      }

      const result = await this.removeBookmarkUseCase.execute(userId, layananId);

      if (!result.success) {
        const err = new Error(result.message);
        err.statusCode = 400;
        throw err;
      }

      res.json({
        success: true,
        message: 'Layanan berhasil dihapus dari bookmark'
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Check if a service is bookmarked
   * GET /api/bookmarks/check/:layananId
   */
  checkBookmark = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      if (req.user.role !== 'client') {
        const err = new Error('Fitur bookmark hanya tersedia untuk client');
        err.statusCode = 403;
        throw err;
      }

      const { layananId } = req.params;
      if (!layananId) {
        const err = new Error('layananId is required');
        err.statusCode = 400;
        throw err;
      }

      const result = await this.checkBookmarkUseCase.execute(userId, layananId);

      res.json({
        success: true,
        message: 'Bookmark status checked successfully',
        data: { isBookmarked: !!result.data?.isFavorite }
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = BookmarkController;