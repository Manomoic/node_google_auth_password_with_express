'use strict';

if( process.env.NODE_ENV !== 'production' )
{
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookie_session = require('cookie-session');
const passport = require('passport');

require('./config/google-passport')(passport);
const port = process.env.PORT || 8000;

const app = express();

const db = require('./config/database');

db.authenticate()
    .then(() => console.log("DB Connected"))
    .catch(errorResponse => console.log(`Error Caught => ${errorResponse}`)
);

app.use(
    cors({ origin: '*', credentials: true, optionsSuccessStatu: 200 })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cookie_session({
        keys: [process.env.EXPRESS_COOKIES_SESSION],
        maxAge: Date.now(),
        httpOnly: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.session.user || null;
    next();
  });

app.get('/', (req, res) => {

    let google_fullName,
        avatar,
        email,
        lastLoggedinAt;

    return res.render('main', {
        google_fullName,
        avatar,
        email,
        lastLoggedinAt
    })
});

app.use('/auth', require('./routes/auth-route'));
app.use('/profile', require('./routes/profile-route'));

app.listen(port, () => console.log(`Listening On Port ${port}!`));