const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
	User.findOne({
		email: req.body.email,
	})
		.exec()
		.then((user) => {
			if (user) {
				return res.status(409).json({
					message: "Email Already Exists",
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: {
								message: err.message,
							},
						});
					} else {
						const user = new User({
							_id: mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
						});
						user
							.save()
							.then((result) => {
								console.log(result);
								res.status(201).json({
									message: "User Successfully Created",
								});
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		});
});

router.post("/login", (req, res, next) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: "Authentaction failed",
				});
			}
			bcrypt.compare(req.body.password, user.password, (err, response) => {
				if (err) {
					res.status(401).json({
						message: "Authentacion Failed",
					});
				}
				if (response) {
					const token = jwt.sign(
						{
							email: user.email,
							userId: user._id,
						},
						process.env.JWT_ID,
						{
							expiresIn: "1h",
						}
					);
					res.status(200).json({
						message: "Authentacion Successful",
						token: token,
					});
				} else {
					res.status(401).json({
						message: "Authentacion Failed",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.delete("/:userId", (req, res, next) => {
	User.deleteOne({ _id: req.params.userId })
		.exec()
		.then(() => {
			res.status(200).json({
				message: "User Successfully deleted",
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: {
					message: err,
				},
			});
		});
});

module.exports = router;
