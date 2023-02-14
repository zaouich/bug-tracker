const { Schema, default: mongoose, model } = require("mongoose");
const Bug = require("../models/bugModel");
const Project = require("./projectSModel");

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
solutionSchema.index({ bug: 1, user: 1 }, { unique: true });
solutionSchema.pre("save", async function (next) {
	await Bug.findByIdAndUpdate(
		this.bug,
		{ sloved: true },
		{ runValidators: true }
	);
	next();
});
solutionSchema.post("findOneAndDelete", async function (doc) {
	const bug = await Bug.findByIdAndUpdate(
		doc.bug,
		{ sloved: false },
		{ new: true }
	);
	await bug.save();
	console.log(bug);
});
const Solution = model("Solution", solutionSchema);
module.exports = Solution;
