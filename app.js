const express = require("express");
const next = require("next");
const dotenv = require("dotenv");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const expressValidator = require("express-validator");
const passport = require("passport");
const MongoStoreSession = require("connect-mongo")(session);

// Load all the models so to be ablee to use singleton object
require("./models/Post");
require("./models/User");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

require("./passport");

// Load all env variables
dotenv.config({ path: "./config/config.env" });

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 8080;
const ROOT_URL = dev ? `http://localhost:${PORT}` : process.env.PRODUCTION_URL;
const nxtApp = next({ dev });
const handle = nxtApp.getRequestHandler();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) =>
  console.log("DB error: ", err.message)
);

nxtApp.prepare().then(() => {
  // Initialize express
  const app = express();

  // Add JSON middleware
  app.use(express.json());

  /* Express Validator middleware to validate form data*/
  app.use(expressValidator());

  // Make public a static folder
  // app.set(express.static(require("path").join(__dirname, "public")));

  /* give all Next.js's requests to Next.js server */
  app.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  app.get("/public/*", (req, res) => {
    handle(req, res);
  });

  app.use(
    session({
      name: "next-connect.sid",
      secret: process.env.SESSION_KEY,
      store: new MongoStoreSession({
        mongooseConnection: mongoose.connection,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
      },
    })
  );

  // Set up passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    /* middleware for user data from passport on the req.user so as to access the user from anywhere t=in the app */
    res.locals.use = req.user || null;
    next();
  });

  // Add morgan logger for dev env
  app.use(logger("dev"));

  /* apply routes from the "routes" folder */
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);

  /* Error handling from async / await functions */
  app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  /* create custom routes with route params */
  // app.get("/profile/:userId", (req, res) => {
  //   const routeParams = Object.assign({}, req.params, req.query);
  //   return app.render(req, res, "/profile", routeParams);
  // });

  /* default route
     - allows Next to handle all other routes
     - includes the numerous `/_next/...` routes which must    be exposedfor the next app to work correctly
     - includes 404'ing on unknown routes */
  app.get("*", (req, res) => {
    handle(req, res);
  });

  app.listen(PORT, () => {
    console.log(`App is ready on ${ROOT_URL} !`);
  });
});
