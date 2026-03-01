const { ApiError } = require("../utils/ApiError");

function validate(schema) {
  return (req, res, next) => {
    try {
      req.validated = schema.parse(req.body);
      next();
    } catch (e) {
      // TEMP: expose Zod issues in dev so we can see which field fails
      if (process.env.NODE_ENV !== "production") {
        return res.status(400).json({
          ok: false,
          error: {
            message: "Validation failed",
            code: "ERR_VALIDATION",
            issues: e?.issues || String(e),
            receivedBody: req.body,
          },
        });
      }
      return next(new ApiError(400, "Validation failed", "ERR_VALIDATION"));
    }
  };
}

module.exports = { validate };