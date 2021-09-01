require("express-async-errors");
const winston = require("winston");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const compression = require("compression");
const LocalStrategy = require("passport-local").Strategy;

const { User } = require("./models/user");
const router = require('./routes')

Joi.objectId = require("joi-objectid")(Joi);

const port = process.env.PORT || 5000;
const app = express();

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.exceptions.handle(
  new winston.transports.Console({ colorize: true, prettyPrint: true }),
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

const db = process.env.MONGO_URI || "mongodb://localhost:27017/test";
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose.connect(db, options).then(() => winston.info(`Connected to ${db}...`));


passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Username doesn't exist" });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect Name or password" });
      }
      return done(null, user);
    });
  })
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then(user => done(null, user))
);


if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(compression());
}

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(
  cors({
    origin: [
      `https://${process.env.HOST}`,
      `http://${process.env.HOST}`,
      `${process.env.HOST}`
    ],
    methods: ["GET", "POST", "PUT", 'DELETE', 'PATCH'],
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router)

app.listen(port, () => winston.info(`Listening on port ${port}...`));

process.on("unhandledRejection", (ex) => {
  throw ex;
});
