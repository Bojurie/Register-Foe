const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model/User");


// Define JWT options for the strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Create a new JWT strategy
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Find the user by ID from the JWT payload
      const user = await User.findById(jwtPayload.sub);

      if (!user) {
        // If user not found, return false and a message
        return done(null, false, { message: "User not found" });
      }

      // If user is found, return the user
      return done(null, user);
    } catch (error) {
      // If an error occurs, return the error
      return done(error, false, { message: "Error during authentication" });
    }
  })
);

// Middleware to authenticate using JWT
const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: info.message });
    }

    // If authentication is successful, attach the user object to the request
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticateJWT;
