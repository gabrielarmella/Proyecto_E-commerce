import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userRepository from "../repositories/user.repository.js";

console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                const email = profile.emails[0].value;

                let user = await userRepository.findOne({ email });

                if (!user) {

                    user = await userRepository.create({
                        name: profile.displayName,
                        email,
                        passwordHash: null,
                        googleId: profile.id,
                        picture: profile.photos[0].value || "",
                        role: "user",
                        authProvider: "google",
                    });
                }else{
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        user.picture = profile.photos[0].value || user.picture;
                        user.authProvider = "google";
                        await user.save();
                    } 
                }
                return done(null, user);
            }catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;    