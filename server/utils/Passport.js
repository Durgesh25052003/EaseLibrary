import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../Models/UserModel.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        console.log(profile);
        let user = await UserModel.findOne({ googleId: profile.id });
        console.log(user)
        if (!user) {
          user = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            isLoggedIn:"true",
            isVerified:"true"
          });
        }
        console.log(user, "✨✨✨");
        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
