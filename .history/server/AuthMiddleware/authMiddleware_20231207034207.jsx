// authMiddleware.js
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../model/User')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "your-secret-key", // Replace with your actual secret key
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Check if the user exists based on the JWT payload
      const user = await User.findById(jwt_payload.sub);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

const AuthenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = AuthenticateJWT;
