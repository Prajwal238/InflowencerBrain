const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../../models/getUsersModel');
const { v4: uuidv4 } = require('uuid');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.HOST_URL}/api/auth/google/callback`,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let isSelfSignedUser = false;
        await userModel.getUserByEmail(profile.emails[0].value).then(user => {
            if(user && user.authProvider === 'local'){
                isSelfSignedUser = true;
            }
        });

        if(isSelfSignedUser){
            return done(null, false, { message: 'Use email and password to login.' });
        }

        let user = await userModel.getUserByGoogleId(profile.id);
    
        if (!user) {
            user = await userModel.getUserByEmail(profile.emails[0].value);
        }
    
        if (!user) {
            user = await userModel.createUserByGoogle({
            _id: "u-" + uuidv4(),
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            authProvider: 'google',
            googleDocsAccessToken: accessToken,
            googleDocsRefreshToken: refreshToken
            });
        } else {
            user.googleDocsAccessToken = accessToken;
            user.googleDocsRefreshToken = refreshToken;
            await user.save();
        }
    
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));
