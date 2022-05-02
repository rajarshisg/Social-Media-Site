const express = require('express'); //requiring express
const cookieParser = require('cookie-parser'); //used to parse cookie data, npm install cookie-parser
const app = express(); //app has access to all the properties of express
require('dotenv').config();
const port = 8000; //server runs on port 8000
const expressLayouts = require('express-ejs-layouts'); //requiring express layouts, npm install express-ejs-layouts, sets up the layout of the website
const db = require('./config/mongoose'); //the database
const session = require('express-session'); //used in session cookie needed by passport
const passport = require('passport'); //passport authentication
const passportLocal = require('./config/passport-local-strategy'); //passport local strategy
const passportGoogle = require('./config/paspport-google-oauth2-strategy'); //passport google strategy
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware'); //scss middleware
const flash = require('connect-flash'); //connect-flash for flash notifications
const customMWare = require('./config/middleware');
//setting up chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log(`Chat server is running on port: 5000`);
//setting up sass middleware
app.use(sassMiddleware({
    src: './assets/scss', //source of  scss files
    dest: './assets/css', //destination where css will be compiled and placed
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(express.urlencoded()); //middleware that parses the incoming data
app.use(cookieParser()); //using cookie parser
app.use(express.static('./assets')); //static files are accessed in assets folder
//make the uplads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

/* Setting up the Layouts */
app.use(expressLayouts); //app uses express-ejs-layouts
app.set('layout extractStyles', true); //extract styles from subpages into layout.ejs file
app.set('layout extractScripts', true); //extract scripts from subpages into layout.ejs file

/* View Engine */
app.set('view engine', 'ejs'); //setting up the view engine
app.set('views', './views'); //location of the views

//Used to generate the session cookie
//mongo store is used to store the session cookie in the db, npm install connect-mongo
app.use(session({
    name: 'connecti', //cookie name
    secret: '2s5v8y/B?D(G+KbPeShVmYq3t6w9z$C&', //encryption key
    saveUninitialized: false, //when user is not logged in no data is saved in cookie
    resave: false, //we do not want to rewrite session cookie if it is not changed
    cookie: {
        maxAge: (1000 * 60 * 60 * 3) //age of the cookie in miliseconds --> 3 hours
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codeial_development',
        },
    )
}));
app.use(passport.initialize()); //app uses passport
app.use(passport.session()); //for maintaining passport session
app.use(passport.setAuthenticatedUser);

//Flash notifications
app.use(flash());
app.use(customMWare.setFlash);

//using express router to route files
app.use('/', require('./routes/index'));

app.listen(port, function (err) {
    //app is listening on port 8000
    if (err) {
        //error in running the server
        console.log(`Error ${err} occured while running the server!`);
        return;
    }
    console.log(`Server is up and running on port ${port}`);
});