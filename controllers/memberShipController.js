const MemberShip = require("../models/memberShipModel");
const Project = require("../models/projectSModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const checkAdmin = async (userId, projectId) => {
	const project = await Project.findById(projectId);
	if (!project) throw new AppError("there is no project found by this id");
	const admin = project.admin;
	if (project.admin.toString() === userId.toString())
		throw new AppError(
			400,
			"you cant leave an project if you own it , go ahead and delete all the roject"
		);
};
// join a project
const postMemberShip = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	const project = req.params.projectId;
	const project_ = await Project.findById(project);
	if (!project_)
		return next(new AppError("401", "there is no project by this id"));
	const { password } = req.body;
	if (!password || password !== project_.password)
		return next(new AppError(401, "you should provid a correct password"));
	const { role } = req.body;
	const memberShip = await MemberShip.create({ user, project, role });
	res.status(201).json({
		status: "success",
		memberShip,
	});
});
// get all memberships if you are admin
const getAllMemberShips = catchAsync(async (req, res, next) => {
	const projectId = req.params.projectId;
	const userId = req.user._id;
	//check if the user is the admin of the project
	const project = await Project.findOne({ _id: projectId, admin: userId });
	if (!project)
		return next(new AppError(400, "you have no project as admin by this id"));
	//show members
	res.status(200).json({
		status: "success",
		memberShips: project.members,
	});
});
// quick out
const deleteMemberShip = catchAsync(async (req, res, next) => {
	const memberShipId = req.params.memberShipId;
	const projectId = req.params.projectId;
	const userId = req.user._id;
	//check if the user is the admin of the project
	const project = await Project.findOne({ _id: projectId, admin: userId });
	if (!project)
		return next(new AppError(400, "you have no project as admin by this id"));
	//check if the membership exicts

	const memberShip = await MemberShip.findByIdAndDelete(memberShipId);
	if (!memberShip)
		return next(new AppError(400, "no member ship found by this id"));
	//show members
	res.status(200).json({
		status: "success",
		memberShips: project.members,
	});
});
// quite the project
const quite = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	const projectId = req.params.projectId;
	const user = await User.findById(userId);
	await checkAdmin(userId, projectId);
	const { password } = req.body;
	if (!password || !(await user.isCorrectPassword(password)))
		return next(new AppError(401, "please provide a valid password"));
	// check if the user is in the project

	const memberShip = await MemberShip.findOneAndDelete({
		user: userId,
		project: projectId,
	});
	if (!memberShip)
		return next(new AppError(401, "you are not in this project"));
	res.status(201).json({
		status: "success",
		message: "you are quite this project",
	});
});
module.exports = { postMemberShip, getAllMemberShips, deleteMemberShip, quite };
