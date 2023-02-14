const { Schema, default: mongoose, model } = require("mongoose");
const Bug = require("../models/bugModel");

const solutionSchema = new Schema({
	bug: {
		type: mongoose.Schema.ObjectId,
		ref: "Bug",
		required: [true, "a solution must belong to a bug"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "a solution must belong to an user"],
	},
	description: {
		type: String,
		required: [true, "a solution must have a description"],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});
solutionSchema.pre("save", async function (next) {
	await Bug.findByIdAndUpdate(
		this.bug,
		{ sloved: true },
		{ runValidators: true }
	);
	next();
});
const Solution = model("Solution", solutionSchema);
module.exports = Solution;
