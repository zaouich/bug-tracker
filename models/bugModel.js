const { Schema, model, mongoose } = require("mongoose");

const bugSchema = new Schema(
	{
		sloved: {
			type: Boolean,
			default: false,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		project: {
			type: mongoose.Schema.ObjectId,
			ref: "Project",
		},
		description: {
			type: String,
			required: [true, "a bug must have a description"],
		},
		expect: {
			type: String,
			required: [true, "tell the team what you expect"],
		},
		createdAt: {
			type: Date,
			default: new Date(),
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
bugSchema.virtual("trys", {
	ref: "Try",
	foreignField: "bug",
	localField: "_id",
});
bugSchema.virtual("solution", {
	ref: "Solution",
	foreignField: "bug",
	localField: "_id",
});
bugSchema.pre(/^find/, function (next) {
	this.find().populate("trys").populate("solution");
	next();
});
const Bug = model("Bug", bugSchema);
module.exports = Bug;
