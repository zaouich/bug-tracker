const Solution = require("../models/solutionModel");
const catchAsync = require("../utils/catchAsync");
const checkOwnerOfBug = require("../utils/checkBugAndProject");

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
