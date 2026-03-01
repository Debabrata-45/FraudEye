const router = require("express").Router();
const { auth } = require("../../middlewares/auth");
const { rbac } = require("../../middlewares/rbac");
const { stats } = require("./queue.controller");

router.get("/stats", auth, rbac("admin", "analyst"), stats);

module.exports = router;