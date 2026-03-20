const router = require("express").Router();
const { auth } = require("../../middlewares/auth");
const { rbac } = require("../../middlewares/rbac");
const { listAlerts, getAlertById } = require("./alerts.controller");

router.get("/", auth, rbac("admin", "analyst"), listAlerts);
router.get("/:id", auth, rbac("admin", "analyst"), getAlertById);

module.exports = router;
