'use strict';

const auth = require('express').Router();
const passport = require('passport');
const passportRedirect = { session: false };

auth.get('/login', (req, res) => res.render('login'));

auth.post('/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

auth.get('/google/redirect', 
    passport.authenticate('google', passportRedirect), (req, res, next) => {
        req.session.user = req.user;
        res.redirect('/profile');
});

module.exports = auth;