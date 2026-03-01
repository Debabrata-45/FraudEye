const { ApiError } = require("../utils/ApiError");

function rbac(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return next(new ApiError(401, "Unauthorized", "ERR_AUTH"));
    if (!allowed.includes(role)) return next(new ApiError(403, "Forbidden", "ERR_RBAC"));
    next();
  };
}

module.exports = { rbac };