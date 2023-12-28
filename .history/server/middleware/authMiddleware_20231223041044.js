const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model/User");
const Company = require("../model/companySchema");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const Model = jwtPayload.isCompany ? Company : User;
      const account = await Model.findById(jwtPayload.id); 

      if (!account) {
        return done(null, false);
      }
      return done(null, account);
    } catch (error) {
      return done(error, false);
    }
  })
);

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, account, info) => {
    if (err) {
      return next(err);
    }
    if (!account) {
      return res.status(401).json({
        error: "Unauthorized",
        message: info?.message || "Invalid token",
      });
    }
    req.user = account; 
    next();
  })(req, res, next);
};

const isCompany = (req, res, next) => {
  if (req.user && req.user.isCompany) {
    next(); 
  } else {
    res.status(403).json({ error: "Access denied: Company rights required" });
  }
};

module.exports = { authenticateJWT, isCompany };
