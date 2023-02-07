const { Schema, mongoose, model } = require("mongoose");

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
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
/* projectSchema.pre(/^find/, function (next) {
	next();
}); */
const Project = model("Project", projectSchema);
module.exports = Project;
