const Bug = require("../models/bugModel");
const MemberShip = require("../models/memberShipModel");
const Project = require("../models/projectSModel");
const Solution = require("../models/solutionModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// check if the user the owner of the bug + still exicts in the project

const checkOwnerOfBug = async (userId, bugId, solutionId, method) => {
	// with bug id
	if (!solutionId) {
		// there is the bug id = post method
		const bug = await Bug.findOne({ _id: bugId, user: userId });
		if (!bug)
			throw new AppError(
				400,
				"there is no bug found or you are not the owner of the bug"
			);
		const member = await MemberShip.findOne({
			user: userId,
			project: bug.project,
		});
		if (!member) throw new AppError(400, "you are no loged to this project");
	}
	// with solution Id
	else {
		// there is o bug id  => there is solution id => delete or update
		// normal case
		const solution_ = await Solution.findById(solutionId);
		if (!solution_)
			throw new AppError(400, "there is no solution found by this id");
		const bugId = solution_.bug;
		const bug_ = await Bug.findOne({ _id: bugId });
		if (!bug_) {
			throw new AppError(400, "there is no bug found by this Id");
		}
		const member = await MemberShip.find({
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
const addSolution = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	const bugId = req.params.bugId;
	const { description } = req.body;
	await checkOwnerOfBug(userId, bugId, null, null);
	const solution = await Solution.create({
		bug: bugId,
		user: userId,
		description,
	});
	res.status(201).json({
		status: "success",
		solution,
	});
});
const deleteSolution = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	const solutionId = req.params.solutionId;
	await checkOwnerOfBug(userId, null, solutionId, "delete");
	const deletedSolution = await Solution.findByIdAndDelete(solutionId);
	res.status(200).json({
		status: "success",
		message: "deleted",
	});
});
module.exports = { addSolution, deleteSolution };
