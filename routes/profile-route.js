const profile = require('express').Router();
const User = require('../models/User');

const {isUserAuthenticated, isUserLoggedOut} = require('../config/authenticate');

profile.get('/', isUserAuthenticated, (req, res, next) => {
    
    const google_user_id = req.session.user.google_user_id;

    User.findOne({ where: { google_user_id: google_user_id} })
        .then((userProfileFound) => {

            const profileObject = {
                id: userProfileFound.dataValues.id,
                google_fullName: userProfileFound.dataValues.google_fullName,
                avatar: userProfileFound.dataValues.avatar,
                email: userProfileFound.dataValues.email,
                lastLoggedinAt: userProfileFound.dataValues.loggedinAt
            };

            return res.render('main', {
                google_fullName: profileObject.google_fullName,
                avatar: profileObject.avatar,
                email: profileObject.email,
                lastLoggedinAt: profileObject.lastLoggedinAt
            });
        })
        .catch((errorsCaught) => console.log(errorsCaught));

});

profile.get('/logout', isUserLoggedOut, (req, res) => {});

module.exports = profile;