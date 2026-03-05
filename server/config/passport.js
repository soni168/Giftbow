const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value;

        // ✅ Pehle googleId se dhundho
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // ✅ Phir same email se dhundho — shayad password wala account ho
        user = await User.findOne({ email });

        if (user) {
          // Email mil gayi — Google se link kar do existing account ko
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = avatar;
          user.isVerified = true; // Google ne verify kar diya
          await user.save();
          return done(null, user);
        }

        // ✅ Bilkul naya user — create karo
        user = await User.create({
          name: profile.displayName,
          email,
          avatar,
          googleId: profile.id,
          isVerified: true, // Google login mein OTP ki zaroorat nahi
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;