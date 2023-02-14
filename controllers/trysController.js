const Try = require("../models/trysModel");
const catchAsync = require("../utils/catchAsync");
const checkOwnerOfBug = require("../utils/checkBugAndProject");

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
