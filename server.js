const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const DB = process.env.DB;
mongoose.connect(DB).then(() => {
	console.log("connected to the db ** ");
});
app.listen(3000, () => {
	console.log("listen to the port 3000.....");
});
