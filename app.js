const path = require('path');
const express = require('express');
const app = express();
const PORT = 4444;
const mongoose = require('mongoose');

const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/' })
}))

const passport = require('./authentication/passport');
app.use(passport.initialize());
app.use(passport.session());


const User=require('./models/user');


const homeRouter=require('./routes/home');
app.use('/',homeRouter);

const adminRouter = require('./routes/admin');
const { isAdmin } = require('./middlewares/isAdmin');
app.use('/admin', isAdmin, adminRouter);

const shopRouter = require('./routes/shop');
const { isLoggedIn } = require('./middlewares/isLoggedIn');
app.use('/shop', isLoggedIn, shopRouter);


mongoose.connect('mongodb://127.0.0.1:27017/ecommerce').then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:` + PORT);
    });
}).catch(err => {
    console.log(err)
})