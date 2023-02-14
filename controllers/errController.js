const deveController = (err, res) => {
	res.status(err.statusCode || 500).json({
		status: err.status,
		message: err.message,
		err,
		errstack: err.stack,
	});
};
const errController = (err, req, res, next) => {
	console.log("*********");

	if (process.env.NODE_ENV === "deve") return deveController(err, res);
};
module.exports = errController;
