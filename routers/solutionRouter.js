const { Router } = require("express");
const {
	addSolution,
	deleteSolution,
} = require("../controllers/solutionController");
const { checkLogin, isVerified } = require("../controllers/authController");

const router = Router({ mergeParams: true });
router.use(checkLogin, isVerified);

router.route("/").post(addSolution);
router.route("/:solutionId").delete(deleteSolution);

module.exports = router;
