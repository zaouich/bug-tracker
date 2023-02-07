const { Router } = require("express");
const { checkLogin, isVerified } = require("../controllers/authController");
const {
	postNewProject,
	getAllProjects,
	getOneProject,
	deleteProject,
	updateProject,
} = require("../controllers/projectController");

const router = Router();
router.use(checkLogin, isVerified);
router.route("/").post(postNewProject).get(getAllProjects);
router
	.route("/:id")
	.get(getOneProject)
	.delete(deleteProject)
	.patch(updateProject);
module.exports = router;
