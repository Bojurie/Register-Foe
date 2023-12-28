const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model/User");


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id); // Assuming 'id' is stored in jwtPayload
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Continue to the next middleware if the user is an admin
  } else {
    res.status(403).json({ error: "Access denied: Admin rights required" });
  }
};
const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({
          error: "Unauthorized",
          message: info?.message || "Invalid token",
        });
    }
    req.user = user;
    next();
  })(req, res, next);
};


module.exports = authenticateJWT;
