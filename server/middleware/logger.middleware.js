const { pushToTaskQueue } = require("../config/taskQueue");

const loggerMiddleware = (req, res, next) => {
    if (req.path !== "/api/crud") {
        return next(); // Skip logging for other endpoints
    }

    const startHrTime = process.hrtime(); // high-res time

    res.on("finish", () => {
        const diff = process.hrtime(startHrTime);
        const responseTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // ms

        const info = {
            projectId: String(req.body?.projectId ) || "-1",
            apiKey: String(req.body?.apiKey || ""),
            operation: String(req.body?.operation || ""),
            tableName: String(req.body?.tableName || ""),
            responseTime: String(responseTime), // in ms
            statusCode: String(res.statusCode),
            userAgent: String(req.headers["user-agent"] || ""),
            ipAddress: String(req.ip || req.connection?.remoteAddress || ""),
            errorMessage: String(req.body?.errorMessage || ""),
        };

        pushToTaskQueue(info).catch(err =>
            console.error("Failed to push log to task queue:", err)
        );
    });

    next();
};

module.exports = loggerMiddleware;
