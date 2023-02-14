const { Router } = require("express");
const { postTry, deleteTry } = require("../controllers/trysController");
const { checkLogin, isVerified } = require("../controllers/authController");

const router = Router({ mergeParams: true });
router.use(checkLogin, isVerified);
router.route("/").post(postTry);
router.route("/:tryId").delete(deleteTry);
module.exports = router;
