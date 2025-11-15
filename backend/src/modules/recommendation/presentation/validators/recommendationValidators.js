const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

/**
 * Validation rules for Get Recommendations endpoint
 */
const getRecommendationsValidation = [
    query('userId')
        .optional()
        .notEmpty()
        .withMessage('User ID cannot be empty if provided')
        .isString()
        .withMessage('User ID must be a string'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be an integer between 1 and 50')
        .toInt(),
    query('refresh')
        .optional()
        .isBoolean()
        .withMessage('Refresh must be a boolean (true/false)')
        .toBoolean(),
    query('exclude')
        .optional()
        .isString()
        .withMessage('Exclude must be a comma-separated string of service IDs'),
    handleValidationErrors
];

/**
 * Validation rules for Get Similar Services endpoint
 */
const getSimilarServicesValidation = [
    param('serviceId')
        .notEmpty()
        .withMessage('Service ID is required')
        .isString()
        .withMessage('Service ID must be a string'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Limit must be an integer between 1 and 20')
        .toInt(),
    query('exclude')
        .optional()
        .isString()
        .withMessage('Exclude must be a comma-separated string of service IDs'),
    handleValidationErrors
];

/**
 * Validation rules for Get Popular Services endpoint
 */
const getPopularServicesValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be an integer between 1 and 50')
        .toInt(),
    query('timeRange')
        .optional()
        .isIn(['24h', '7d', '30d', 'all'])
        .withMessage('Time range must be one of: 24h, 7d, 30d, all'),
    query('category')
        .optional()
        .isString()
        .withMessage('Category must be a string')
        .trim(),
    query('exclude')
        .optional()
        .isString()
        .withMessage('Exclude must be a comma-separated string of service IDs'),
    handleValidationErrors
];

/**
 * Validation rules for Track Interaction endpoint
 */
const trackInteractionValidation = [
    body('userId')
        .optional()
        .notEmpty()
        .withMessage('User ID cannot be empty if provided')
        .isString()
        .withMessage('User ID must be a string'),
    body('serviceId')
        .notEmpty()
        .withMessage('Service ID is required')
        .isString()
        .withMessage('Service ID must be a string'),
    body('interactionType')
        .notEmpty()
        .withMessage('Interaction type is required')
        .isIn(['view', 'click', 'like', 'unlike', 'order', 'rating', 'hide'])
        .withMessage('Invalid interaction type. Must be one of: view, click, like, unlike, order, rating, hide'),
    body('value')
        .optional()
        .isNumeric()
        .withMessage('Value must be a number')
        .toFloat(),
    body('metadata')
        .optional()
        .isObject()
        .withMessage('Metadata must be an object'),
    handleValidationErrors
];

/**
 * Validation rules for Add Favorite endpoint
 */
const addFavoriteValidation = [
    param('serviceId')
        .notEmpty()
        .withMessage('Service ID is required')
        .isString()
        .withMessage('Service ID must be a string'),
    body('userId')
        .optional()
        .notEmpty()
        .withMessage('User ID cannot be empty if provided')
        .isString()
        .withMessage('User ID must be a string'),
    body('notes')
        .optional()
        .isString()
        .withMessage('Notes must be a string')
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters')
        .trim(),
    handleValidationErrors
];

/**
 * Validation rules for Remove Favorite endpoint
 */
const removeFavoriteValidation = [
    param('serviceId')
        .notEmpty()
        .withMessage('Service ID is required')
        .isString()
        .withMessage('Service ID must be a string'),
    query('userId')
        .optional()
        .notEmpty()
        .withMessage('User ID cannot be empty if provided')
        .isString()
        .withMessage('User ID must be a string'),
    handleValidationErrors
];

/**
 * Validation rules for Get Interaction History endpoint
 */
const getInteractionHistoryValidation = [
    query('userId')
        .optional()
        .notEmpty()
        .withMessage('User ID cannot be empty if provided')
        .isString()
        .withMessage('User ID must be a string'),
    query('serviceId')
        .optional()
        .isString()
        .withMessage('Service ID must be a string'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100')
        .toInt(),
    handleValidationErrors
];

module.exports = {
    getRecommendationsValidation,
    getSimilarServicesValidation,
    getPopularServicesValidation,
    trackInteractionValidation,
    addFavoriteValidation,
    removeFavoriteValidation,
    getInteractionHistoryValidation
};