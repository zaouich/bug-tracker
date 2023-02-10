const { Router } = require("express");
const { checkLogin, isVerified } = require("../controllers/authController");
const {
	postMemberShip,
	getAllMemberShips,
	deleteMemberShip,
	quite,
} = require("../controllers/memberShipController");

const router = Router({ mergeParams: true });
router.use(checkLogin, isVerified);
router.route("/").post(postMemberShip).get(getAllMemberShips).delete(quite);
router.route("/:memberShipId").delete(deleteMemberShip);
module.exports = router;
