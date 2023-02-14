const MemberShip = require("../models/memberShipModel");
const Try = require("../models/trysModel");
const Bug = require("../models/bugModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projectSModel");

// check if the user the owner of the bug + still exicts in the project
const checkOwnerOfBug = async (userId, bugId, tryId, method) => {
	// with bug id
	if (!tryId) {
		// there is the bug id = post method
		const bug = await Bug.findOne({ _id: bugId, user: userId });
		if (!bug) throw new AppError(400, "you are not the owner of the bug");
		const member = await MemberShip.findOne({
			user: userId,
			project: bug.project,
		});
		if (!member) throw new AppError(400, "you are no loged to this project");
	}
	// with try Id
	else {
		// there is o bug id  => there is try id => delete or update
		// normal case
		const try_ = await Try.findById(tryId);
		if (!try_) throw new AppError(400, "there is no try found by this id");
		const bugId = try_.bug;
		const bug_ = await Bug.findOne({ _id: bugId });
		if (!bug_) {
			throw new AppError(400, "there is no bug found by this Id");
		}
		const member = await MemberShip.findOne({
			user: userId,
			project: bug_.project,
		});
		if (!member) throw new AppError(400, "you are not loged to this project");
		const isBug = await Bug.findOne({ _id: bugId, user: userId });

		if (!isBug) {
			if (method === "update")
				throw new AppError(400, "you are not the owner of the bug");
			if (method === "delete") {
				// admin case

				// try to check if the user is an admin
				const bug = await Bug.findById(bugId);
				const project = await Project.findById(bug.project);
				if (!project) throw new AppError(400, "there is no project found ");
				if (project.admin.toString() !== userId.toString())
					throw new AppError(
						400,
						"you are not the owner of the bug or the admin of the project "
					);
			}
		}
	}
};

const postTry = catchAsync(async (req, res, next) => {
	const { description } = req.body;
	const userId = req.user._id;
	const bugId = req.params.bugId;
	await checkOwnerOfBug(userId, bugId, null, null);
	const newTry = await Try.create({
		description,
		bug: bugId,
		user: userId,
	});
	res.status(201).json({
		status: "success",
		newTry,
	});
});
// delete the try
const deleteTry = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	const tryId = req.params.tryId;
	await checkOwnerOfBug(userId, null, tryId, "delete");
	await Try.findByIdAndDelete(tryId);
	res.status(200).json({
		status: "success",
		message: "deleted",
	});
});
module.exports = { postTry, deleteTry };
