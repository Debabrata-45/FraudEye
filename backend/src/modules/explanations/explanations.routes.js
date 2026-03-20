const router = require("express").Router();
const { auth } = require("../../middlewares/auth");
const { rbac } = require("../../middlewares/rbac");
const {
  getExplanation,
  listExplanations,
} = require("./explanations.controller");

router.get("/", auth, rbac("admin", "analyst"), listExplanations);
router.get("/:id", auth, rbac("admin", "analyst"), getExplanation);

module.exports = router;
