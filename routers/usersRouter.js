const { Router } = require("express");
const {
	signUp,
	login,
	checkLogin,
	isVerified,
	verify,
	isLoggedIn,
} = require("../controllers/authController");

const router = Router();
router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/checkLogin").get(isLoggedIn);
router.route("/verifyEmail/:validateToken").get(verify);
router
	.route("/test")
	.get(checkLogin, isVerified, (req, res, next) => console.log("test"));

module.exports = router;
