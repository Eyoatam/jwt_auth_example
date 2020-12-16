const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoute = require("./routes/user");

mongoose.connect(
	"mongodb+srv://Eyoatam:" +
		process.env.MONGO_ATLAS_PASSWORD +
		"@node-express-api.ehvwe.mongodb.net/<dbname>?retryWrites=true&w=majority",
	{ useUnifiedTopology: true, useNewUrlParser: true }
);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoute);

app.use((req, res, next) => {
	const error = new Error("Whoops!! Page Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
