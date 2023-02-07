const validator = require("validator");
const bcrypt = require("bcrypt");
const { mongoose, model } = require("mongoose");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			required: [true, "why no user name ?"],
			unique: true,
		},
		email: {
			type: String,
			validate: [validator.isEmail, "please provide a valid email !"],
			required: [true, "why no  name ?"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "why no  name ?"],
			minlength: [8, "password should at less 8 char"],
		},
		confirmPassword: {
			type: String,
			required: [true, "you should repate your password"],
			validate: {
				validator: function (val) {
					return val === this.password;
				},
				message: "passwords not match",
			},
		},
		changedAt: Date,
		active: {
			type: Boolean,
			default: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		verificationToken: String,
		resetToken: String,
		expriesResetToken: Date,
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.virtual("projects", {
	ref: "Project",
	foreignField: "admin",
	localField: "_id",
});

userSchema.pre(/^find/, function (next) {
	this.populate("projects").find({ active: true });
	next();
});

userSchema.pre("save", function (next) {
	if (this.isNew) {
		this.password = bcrypt.hashSync(this.password, 12);
		this.confirmPassword = undefined;
	}
	next();
});

userSchema.methods.changePassword = function (iat) {
	if (!this.changedAt) return false;
	return parseInt(iat * 1000 < this.changedAt);
};
userSchema.methods.isCorrectPassword = async function (condidatPassword) {
	return await bcrypt.compare(condidatPassword, this.password);
};
userSchema.methods.createVerificationToken = async function () {
	const verificationToken = crypto.randomBytes(31).toString("hex");
	const _verificationToken = crypto
		.createHash("sha256")
		.update(verificationToken)
		.digest("hex");
	this.verificationToken = _verificationToken;
	return verificationToken;
};
userSchema.methods.isVerified = async function () {
	return this.verified;
};
const User = model("User", userSchema);
module.exports = User;
