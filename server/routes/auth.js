
const moment = require("moment");
const passport = require("passport");
const express = require("express");
const crypto = require("crypto");
const winston = require("winston");

const {
  validateLoginInput,
  validateRegisterInput,
  validateEmail,
  validatePassword,
} = require("../validation/users");
const { Token } = require("../models/token");
const { User } = require("../models/user");
const transport = require('../utils/nodemailer')
const router = express.Router();

const { USER_EMAIL, HOST } = process.env

router.post("/login", (req, res, next) => {
  const { body } = req
  const { error } = validateLoginInput(body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  body.username = body.username.toLowerCase();

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err)
    if (info && info.message === "Missing credentials") return res.status(400).send({ message: "Missing credentials" });
    if (!user) return res.status(400).send({ message: "Invalid email or password." });
    if (!user.isVerified) return res.status(401).send({ message: "Your account has not been verified. Please activate your account." });

    req.login(user, (err) => {
      if (err) res.status(401).send({ message: "Authentication failed", err });
      res.status(200).send({ message: "Login success", user: user.hidePassword() });
    });
  })(req, res, next);
});

router.post("/login/forgot", async (req, res) => {
  const { body } = req
  const { error } = validateEmail(body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const user = await User.findOne({ email: body.email })
    if (!user) return res.status(404).send({ message: "No user found with this email address." });

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    user.passwordResetToken = token.token;
    user.passwordResetExpires = moment().add(12, "hours");

    await user.save();
    await token.save();

    const mailOptions = {
      from: USER_EMAIL,
      to: user.email,
      subject: "Reset password link",
      text: "Some useless text",
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n
        <a href="http://${HOST}/login/reset/${token.token}">http://${HOST}/login/reset/${token.token}</a> \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n </p>`,
    };

    await transport.sendMail(mailOptions)
    return res.status(200).send({ message: `A validation email has been sent to ${user.email}` });
  } catch (err) {
    return res.status(500).send({ message: "An unexpected error occurred", err });
  }
});


router.post("/login/reset/:token", async (req, res) => {
  const { body, params } = req
  const { error } = validatePassword(body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const token = await Token.findOne({ token: params.token })
    if (!token) return res.status(404).send({ message: "This token is not valid. Your token may have expired." });

    const user = await User.findById(token.userId);
    if (!user) return res.status(404).send({ message: `We were unable to find a user for this token.` });
    if (user.passwordResetToken !== token.token) return res.status(400).send({ message: "User token and your token didn't match. You may have a more recent token in your mail list." });
    if (moment().utcOffset(0) > user.passwordResetExpires) return res.status(400).send({ message: "You cannot reset your password. The reset token has expired. Please go through the reset form again.", })

    user.password = body.password;
    user.passwordResetToken = "";
    user.passwordResetExpires = moment().utcOffset(0);

    await user.hashPassword();
    await user.save();

    const mailOptions = {
      from: USER_EMAIL,
      to: user.email,
      subject: "Your password has been changed",
      text: "Some useless text",
      html: `<p>This is a confirmation that the password for your account ${user.email} has just been changed. </p>`,
    };

    await transport.sendMail(mailOptions);
    return res.status(200).send({ message: "Password has been successfully changed." });
  } catch (err) {
    return res.status(500).send({ message: "An unexpected error occurred", err })
  }
})

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send({ message: "Logout failed", err });
    req.sessionID = null;
    req.logout();
    res.status(200).send({ message: "Logout success" });
  });
});

router.post("/register", async (req, res) => {
  const { body } = req
  const { error } = validateRegisterInput(body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    let user = await User.findOne({ username: body.username.toLowerCase() });
    if (user) return res.status(400).send({ message: "Username already taken. Take an another username" });

    user = await User.findOne({ email: body.email.toLowerCase() });
    if (user) return res.status(400).send({ message: "Email already registered. Take an another email" });


    user = new User(body);

    await user.hashPassword();
    await user.save()

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save()
    const mailOptions = {
      from: USER_EMAIL,
      to: user.email,
      subject: "Email Verification",
      text: "Some uselss text",
      html: `<p>Please verify your account by clicking the link: 
            <a href="http://${HOST}/account/confirm/${token.token}">http://${HOST}/account/confirm/${token.token}</a> </p>`,
    };

    await transport.sendMail(mailOptions)

    return res.status(200).send({ message: "A verification mail has been sent." });
  } catch (err) {
    User.findOneAndDelete({ email: user.email, isVerified: false }, (err) => {
      if (err) {
        return res
          .status(500)
          .send(
            "Impossible to delete the created user. Contact support or wait 12 hours to retry."
          );
      }
    });

    return res.status(503).send({ message: `Impossible to send an email to ${body.email}, try again. Our service may be down.`, err });
  }
})

router.post("/resend", async (req, res) => {
  const { body } = req
  const { error } = validateEmail(body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const user = await User.findOne({ email: body.email })
    if (!user) return res.status(404).send({ message: "We were unable to find a user with that email." });
    if (user.isVerified) return res.status(400).send({ message: "This account has already been verified. Please log in." });

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save()
    const mailOptions = {
      from: USER_EMAIL,
      to: user.email,
      subject: "Email Verification",
      text: "Some uselss text",
      html: `<p>Please verify your account by clicking the link: 
        <a href="http://${HOST}/account/confirm/${token.token}">http://${HOST}/account/confirm/${token.token}</a> </p>`,
    };

    await transport.sendMail(mailOptions)
    return res.status(200).send({ message: "A verification mail has been sent." });
  } catch (err) {
    return res.status(500).send({ message: "An unexpected error occurred", err })
  }
});

router.post("/register/reset", async (req, res) => {
  const { error } = validateEmail(body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const user = await User.findOneAndDelete({ email: body.email, isVerified: false })
    if (!user) return res.status(404).send("User not found");

    return res.status(200).send({ message: "User reset success" });
  } catch (err) {
    return res.status(500).send("An unexpected error occurred")
  }
});

router.get("/confirmation/:token", async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token })
    if (!token) return res.status(404).send({ message: "We were unable to find a valid token. Your token may have expired." });

    const user = await User.findById(token.userId)
    if (!user) return res.status(404).send({ message: `We were unable to find a user for this token.` });
    if (user.isVerified) return res.status(400).send({ message: "This user has already been verified. Please log in." });

    user.isVerified = true;
    user.expires = null;
    await user.save()
    return res.status(200).send({ message: "The account has been verified. Please log in." });
  } catch (err) {
    return res.status(500).send({ message: "An unexpected error occurred", err });
  }
});

module.exports = router;
