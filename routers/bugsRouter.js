const trysRouter = require("./tryesRouter");
const solutionsRouter = require("./solutionRouter");
const commentsRouter = require("./commentsRouter");

const { Router } = require("express");
const {
	postNewBug,
	updateBug,
	deleteBug,
} = require("../controllers/bugContoller");
const { checkLogin, isVerified } = require("../controllers/authController");

const router = Router({ mergeParams: true });
router.use("/:bugId/trys", trysRouter);
router.use("/:bugId/solutions", solutionsRouter);
router.use("/:bugId/comments", commentsRouter);
router.use(checkLogin, isVerified);

router.route("/").post(postNewBug);

router.route("/:bugId").patch(updateBug).delete(deleteBug);
module.exports = router;
