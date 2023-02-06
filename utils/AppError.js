class AppError extends Error {
	constructor(statusCode, message) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${this.statusCode}`.startsWith("4") ? "faild" : "error";
		this.message = message;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}
module.exports = AppError;
