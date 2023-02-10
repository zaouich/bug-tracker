const Bug = require("../models/bugModel");
const MemberShip = require("../models/memberShipModel");
const Project = require("../models/projectSModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
// post a bug
const postNewBug = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	const projectId = req.params.projectId;
	console.log(projectId, "*********");
	const { description, expect } = req.body;
	console.log(projectId);
	const project = await Project.findById(projectId);
	if (!project) return next(new AppError(400, "no project found by this id"));
	console.log(project);
	const memberShips = await MemberShip.findOne({ user, project: projectId });
	if (!memberShips)
		return next(new AppError(401, "you are not leged to this project"));
	const bug = await Bug.create({
		user,
		project: projectId,
		description,
		expect,
	});
	res.status(201).json({
		status: "success",
		bug,
	});
});
// update a bug
const updateBug = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	let body_ = { ...req.body };
	const allowed = ["expect", "description"];
	Object.keys(body_).forEach((element) => {
		if (!allowed.includes(element)) delete body_[element];
	});
	const t = await Bug.find();
	console.log(t);
	const updated = await Bug.findOneAndUpdate(
		{ _id: req.params.bugId, user },
		body_,
		{
			runValidators: true,
			new: true,
		}
	);
	if (!updated)
		return next(new AppError(400, "there is no bug for you by this id"));
	res.status(201).json({
		status: "success",
		updated,
	});
});
//delete a bug
const deleteBug = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	const bugId = req.params.bugId;
	const bug = await Bug.findOneAndDelete({ user, _id: bugId });
	if (!bug)
		return next(new AppError(401, "there is no bug for you by this id"));
	res.status(200).json({
		status: "success",
		message: "deleted",
	});
});
// get all bugs for your in a project
const getAllBugs = async (req, res, next) => {
	const user = req.user._id;
	const project = req.params.projectId;
	const bugs = await Bug.find({
		project,
		user,
	});
	if (!bugs) return next(new AppError("you have no bug in this project"));
};
// delete a bug as an admin
const deleteBugAsAdmin = async (req, res, next) => {
	const bug = req.params.bugId;
	const project = req.params.projectId;
	const user = req.user._id;
	const targetBug = await Bug.findById(bug);
	if (!targetBug)
		return next(new AppError(400, "there is no bug found by this id"));
	const targetProject = Project.findOne({ _id: project, admin: user });
	if (!targetProject)
		return next(new AppError(400, "you are not the admin of the project"));
};

module.exports = { postNewBug, updateBug, deleteBug };
