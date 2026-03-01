const { ApiError } = require("../utils/ApiError");
const { logger } = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const e = err instanceof ApiError ? err : new ApiError(500, "Internal Server Error");
  if (!(err instanceof ApiError)) logger.error(err);

  res.status(e.statusCode).json({
    ok: false,
    error: {
      message: e.message,
      code: e.code,
    },
  });
}

module.exports = { errorHandler };