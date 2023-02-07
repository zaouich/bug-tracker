const { Router } = require("express");
const { checkLogin, isVerified } = require("../controllers/authController");
const {
	postMemberShip,
	getAllMemberShips,
	deleteMemberShip,
} = require("../controllers/memberShipController");

const router = Router({ mergeParams: true });
router.use(checkLogin, isVerified);
router.route("/").post(postMemberShip).get(getAllMemberShips);
router.route("/:memberShipId").delete(deleteMemberShip);
module.exports = router;
