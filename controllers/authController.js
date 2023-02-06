const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const passport = (user, res) => {
	const jwt_ = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
		expiresIn: process.env.JWTEXPIRES,
	});
	res.cookie("jwt", jwt_, {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
	});
	return jwt_;
};
const signUp = catchAsync(async (req, res, next) => {
	const { userName, email, password, confirmPassword } = req.body;
	const user = await User.create({
		userName,
		email,
		password,
		confirmPassword,
	});
	const jwt_ = passport(user, res);
	res.status(201).json({
		status: "success",
		user,
		jwt_,
	});
});

const checkLogin = catchAsync(async (req, res, next) => {
	// check if the user exicts
	if (!req.cookies.jwt) {
		if (
			!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer")
		)
			return next(
				new AppError(401, "you are not loged in please login first !")
			);
	}
	// get the token
	let token = "";
	if (req.cookies.jwt) {
		token = req.cookies.jwt;
	} else {
		token = req.headers.authorization.split(" ")[1];
	}
	//check the token
	const verified = jwt.verify(token, process.env.JWTSECRET);
	// check if the user still exicts
	const user = await User.findById(verified.id);
	if (!user)
		return next(
			new AppError(401, "this user no more exicts please try to login !!")
		);
	//check if the user  chaged his password
	if (await user.changePassword(verified.iat))
		return next(
			new AppError(
				401,
				"the user has been chaged his password , please try login again"
			)
		);
	req.user = user;
	next();
});
const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if ((!email, !password))
		return next(new AppError(400, "you should enter your email and password"));
	const user = await User.findOne({ email });
	if (!user || !(await user.isCorrectPassword(password)))
		return next(new AppError(400, "invalid email or password"));
	const jwt = passport(user, res);
	res.status(201).json({
		status: "success",
		user,
		jwt,
	});
});
const isVerified = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	if (!(await user.isVerified())) {
		const token = await user.createVerificationToken();
		await user.save({ validateBeforeSave: false });
		try {
			await sendMail({
				to: user.email,
				subject: "verify your email",
				text: `${req.protocol}://${req.get(
					"host"
				)}/api/v1/users/verifyEmail/${token}`,
			});
		} catch (error) {
			user.verificationToken = undefined;
			await user.save({ validateBeforeSave: false });
			return next(new AppError(500, "error during sending message"));
		}
		return next(
			new AppError(401, "please check your email to verify your email")
		);
	}
	next();
});

const verify = catchAsync(async (req, res, next) => {
	const token = req.params.validateToken;
	const cryptedToken = crypto.createHash("sha256").update(token).digest("hex");
	const user = await User.findOne({ verificationToken: cryptedToken });
	if (!user) return next(new AppError(400, "invalid validatation link"));
	user.verified = true;
	user.verificationToken = undefined;
	await user.save({ validateBeforeSave: false });
	res.status(200).json({
		status: "success",
		message: "confirmed !!",
	});
});
// check if the user loged in wothout errors
const isLoggedIn = catchAsync(async (req, res, next) => {
	// check if the user exicts
	if (!req.cookies.jwt) {
		if (
			!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer")
		)
			return res.status(200).json({
				status: "sucess",
				loged: false,
			});
	}
	// get the token
	let token = "";
	if (req.cookies.jwt) {
		token = req.cookies.jwt;
	} else {
		token = req.headers.authorization.split(" ")[1];
	}
	//check the token
	let verified = "";
	try {
		verified = jwt.verify(token, process.env.JWTSECRET);
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			status: "sucess",
			loged: false,
		});
	}
	// check if the user still exicts
	const user = await User.findById(verified.id);
	if (!user)
		return res.status(200).json({
			status: "sucess",
			loged: false,
		});
	//check if the user  chaged his password
	if (await user.changePassword(verified.iat)) return res.send(false);
	res.status(200).json({
		status: "sucess",
		loged: true,
		user,
	});
	next();
});

module.exports = {
	signUp,
	login,
	checkLogin,
	isVerified,
	verify,
	isLoggedIn,
};
