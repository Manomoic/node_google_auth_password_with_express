'use strict';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

module.exports = (passport) => {

    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/redirect'
        }, (accessToken, refreshToken, profile, done) => {

            User.findOne(
                {
                    attributes: ['google_user_id']
                }
            )
            .then((userProfile) => {

                const profileObject = {
                    google_user_id: profile.id,
                    google_fullName: profile.displayName,
                    avatar: profile.photos[0].value,
                    email: profile.emails[0].value,
                    isEmailVerified: profile.emails[0].verified,
                    accessToken: accessToken,
                    loggedinAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
                };

                if(userProfile==null) {

                    User.create(profileObject)
                    .then(profile => {
                        
                        console.log({ Create_Profile: profile })
                        done(null, profile);
                    })
                    .catch(errorCaught => console.log(errorCaught) );

                } else {
            
                    User.update({
                        accessToken: accessToken,
                        loggedinAt: profileObject.loggedinAt
                    },{ where: { google_user_id: profile.id } })
                    .then((userUpdated) => console.log(userUpdated))
                    .catch(errorUpdateSql => console.log(errorUpdateSql))

                    return done(null, userProfile);
                }
                
            })
            .catch(errorCaught => console.log({ 'Query': errorCaught }) );

        })
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        
        return User.findOne({ where: { google_user_id: id } })
            .then(user => done(null, user))
            .catch(errorCaught => done(null, errorCaught))
    });
}