const router = require("express").Router();
const { auth } = require("../../middlewares/auth");
const { rbac } = require("../../middlewares/rbac");
const { getAuditLogs, getAuditLogById } = require("./audit.controller");

router.get("/", auth, rbac("admin", "analyst"), getAuditLogs);
router.get("/:id", auth, rbac("admin", "analyst"), getAuditLogById);

module.exports = router;
