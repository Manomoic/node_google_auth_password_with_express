'use strict';

const User = require('../models/User');

const isUserAuthenticated = (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');

    return next();
}

const isUserLoggedOut = (req, res, next) => {

    return User.findOne({ where: { google_user_id: req.session.user.google_user_id } })
        .then((isUserFound) => {

            User.update({ 
                isEmailVerified: 'false',
                accessToken: '',
                loggedinAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
            },{
                where: { google_user_id: req.session.user.google_user_id}
            })
            .then((userUpdated) => {
                req.logout();

                res.redirect('/auth/login');
            })
            .catch((errorsCaught) => console.log(errorsCaught));

        })
        .catch((updateErrorsCaught) => console.log(updateErrorsCaught))
}

module.exports = { isUserAuthenticated, isUserLoggedOut }