const { Schema, model, mongoose } = require("mongoose");

const bugSchema = new Schema({
	slover: {
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
});

const Bug = model("Bug", bugSchema);
module.exports = Bug;
