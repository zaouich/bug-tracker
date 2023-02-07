const { Router } = require("express");
const { checkLogin, isVerified } = require("../controllers/authController");
const {
	postNewProject,
	getAllProjects,
	getOneProject,
	deleteProject,
	updateProject,
	joinProject,
} = require("../controllers/projectController");
const memberShipsRouter = require("./memberShipsRouter");
const router = Router();
router.use("/:projectId/memberShips", memberShipsRouter);
router.use(checkLogin, isVerified);
router.route("/").post(postNewProject).get(getAllProjects);
router
	.route("/:id")
	.get(getOneProject)
	.delete(deleteProject)
	.patch(updateProject);
module.exports = router;
