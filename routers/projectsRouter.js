const { Router } = require("express");
const { checkLogin, isVerified } = require("../controllers/authController");
const {
	postNewProject,
	getAllProjects,
	getOneProject,
	deleteProject,
	updateProject,
} = require("../controllers/projectController");
const memberShipsRouter = require("./memberShipsRouter");
const bugsRouter = require("./bugsRouter");
const router = Router();

router.use("/:projectId/memberShips", memberShipsRouter);

router.use("/:projectId/bugs", bugsRouter);
router.use(checkLogin, isVerified);
router.route("/").post(postNewProject).get(getAllProjects);
router
	.route("/:id")
	.get(getOneProject)
	.delete(deleteProject)
	.patch(updateProject);
module.exports = router;
