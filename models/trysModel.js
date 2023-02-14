const { Schema, mongoose, model } = require("mongoose");

const trySchema = new Schema({
	date: {
		type: Date,
		default: Date.now(),
	},
	description: {
		type: String,
		required: [true, "a try must have a description"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},
	bug: {
		type: mongoose.Schema.ObjectId,
		ref: "Bug",
	},
});
const Try = model("Try", trySchema);
module.exports = Try;
