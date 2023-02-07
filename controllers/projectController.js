const { json } = require("body-parser");
const Project = require("../models/projectSModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// add new project
const postNewProject = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	const { name, description } = req.body;
	console.log("test");
	const project = await Project.create({ name, description, admin: user });
	res.status(201).json({
		status: "success",
		project,
	});
});
const getAllProjects = async (req, res, next) => {
	const user = req.user._id;
	const projects = await Project.find({ admin: user });
	res.status(200).json({
		status: "success",
		projects,
	});
};

const getOneProject = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	const project = await Project.findOne({ _id: req.params.id, admin: user });
	if (!project)
		return next(new AppError(400, "there is no poject for u by  this id"));
	res.status(200).json({
		status: "success",
		project,
	});
});
const deleteProject = catchAsync(async (req, res, next) => {
	const user = req.user._id;
	const project = await Project.findOne({ _id: req.params.id, admin: user });
	if (!project)
		return next(new AppError(400, "there is no poject for u by  this id"));
	const user_ = await User.findById(req.user._id);
	const { password } = req.body;
	if (!password || !(await user_.isCorrectPassword(password)))
		return next(new AppError(401, "you should provide a correct password"));

	await Project.findByIdAndDelete(project._id);
	res.status(200).json({
		status: "success",
		message: "deleted",
	});
});
const updateProject = catchAsync(async (req, res, next) => {
	const body_ = { ...req.body };
	const allowed = ["name", "description"];
	Object.keys(body_).forEach((el) => {
		if (!allowed.includes(el)) delete body_[el];
	});
	const user = req.user._id;
	const project = await Project.findOne({ _id: req.params.id, admin: user });
	if (!project)
		return next(new AppError(400, "there is no poject for u by  this id"));
	console.log(body_);
	const updated = await Project.findByIdAndUpdate(project._id, body_, {
		new: true,
		runValidators: true,
	});
	console.log(updated);
	res.status(200).json({
		status: "success",
		updated,
	});
});
module.exports = {
	postNewProject,
	getAllProjects,
	getOneProject,
	getOneProject,
	deleteProject,
	updateProject,
};
