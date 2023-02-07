const MemberShip = require("../models/memberShipModel");
const Project = require("../models/projectSModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

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
module.exports = { postMemberShip, getAllMemberShips, deleteMemberShip };
