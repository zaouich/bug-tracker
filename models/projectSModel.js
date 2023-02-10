const { Schema, mongoose, model } = require("mongoose");
const MemberShip = require("./memberShipModel");

const projectSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "a project must have a name"],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		admin: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "a project must belong to an admin"],
		},
		description: {
			type: String,
			required: [true, "a broject must have a description"],
		},
		password: {
			type: String,
			required: [true, "a project must have a password"],
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
projectSchema.virtual("members", {
	ref: "MemberShip",
	foreignField: "project",
	localField: "_id",
});
projectSchema.virtual("bugs", {
	ref: "Bug",
	foreignField: "project",
	localField: "_id",
});
projectSchema.virtual("nBugs", function () {
	return this.bugs.length();
});
projectSchema.pre(/^find/, async function (next) {
	this.populate("members").populate("bugs");
	next();
});
projectSchema.pre("save", async function (next) {
	await MemberShip.create({
		user: this.admin,
		project: this._id,
		role: "admin",
	});
	next();
});
const Project = model("Project", projectSchema);
module.exports = Project;
