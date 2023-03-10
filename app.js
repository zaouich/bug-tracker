const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const usersRouter = require("./routers/usersRouter");
const projectsRouter = require("./routers/projectsRouter");
const bugsRouter = require("./routers/bugsRouter");
const trysRouter = require("./routers/tryesRouter");
const solutionsRouter = require("./routers/solutionRouter");
const commentsRouter = require("./routers/commentsRouter");
const errController = require("./controllers/errController");
const { use } = require("./routers/usersRouter");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
const app = express();
app.use(
	cors({
		origin: "http://localhost:3001",
		credentials: true,
	})
);
app.use(cookieParser());

app.use(express.json());
module.exports = app;
// routers
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/bugs", bugsRouter);
app.use("/api/v1/trys", trysRouter);
app.use("/api/v1/solutions", solutionsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use(errController);
