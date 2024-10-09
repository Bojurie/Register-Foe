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

      const userForRequest = {
        id: account._id,
        username: account.username,
        isCompany: jwtPayload.isCompany,
      };

      return done(null, userForRequest);
    } catch (error) {
      return done(error, false);
    }
  })
);

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticateJWT  };
