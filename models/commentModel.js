const { Schema, mongoose } = require("mongoose");

const commentSchema = new Schema({
	createdAt: {
		type: Date,
		deafult: Date.now(),
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "a comment must belong to an user"],
	},
	bug: {
		type: mongoose.Schema.ObjectId,
		ref: "Bug",
		required: [true, "a comment must belong to a bug"],
	},
	text: {
		type: String,
		required: [true, "what you want to say by this comment"],
	},
});
const Comment = model("Comment", commentSchema);
module.exports = Comment;
