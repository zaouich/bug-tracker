const { Schema, mongoose, model } = require("mongoose");
const { object } = require("webidl-conversions");

const memberShipSchema = new Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "a member ship should be long to a user"],
	},
	project: {
		type: mongoose.Schema.ObjectId,
		ref: "Project",
		required: [true, "a project must belong to a project"],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});
memberShipSchema.index({ user: 1, project: 1 }, { unique: true });
const MemberShip = model("MemberShip", memberShipSchema);
module.exports = MemberShip;
