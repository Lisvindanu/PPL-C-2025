// File: AdminLogController.js (Perbaikan, menggunakan CommonJS)

class AdminLogController {
    constructor(getAdminActivityLog) {
        this.getAdminActivityLog = getAdminActivityLog;
    }

    async getActivityLog(req, res) {
        try {
            const { adminId, action, targetType, startDate, endDate, limit, offset } = req.query;

            const filters = {
                ...(adminId && { adminId }),
                ...(action && { action }),
                ...(targetType && { targetType }),
                ...(startDate && endDate && { startDate, endDate }),
                limit: parseInt(limit) || 50,
                offset: parseInt(offset) || 0,
            };

            const logs = await this.getAdminActivityLog.execute(filters);

            res.json({
                success: true,
                data: logs,
                pagination: {
                    limit: filters.limit,
                    offset: filters.offset,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

// ✅ GUNAKAN EKSPOR COMMONJS INI:
module.exports = AdminLogController;