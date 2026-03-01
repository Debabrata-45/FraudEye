const router = require("express").Router();
const { auth } = require("../../middlewares/auth");
const { rbac } = require("../../middlewares/rbac");
const { getSummary } = require("./analytics.controller");

router.get("/summary", auth, rbac("admin", "analyst"), getSummary);

module.exports = router;