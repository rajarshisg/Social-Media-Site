const express = require('express'); //requiring express
const cookieParser = require('cookie-parser'); //used to parse cookie data, npm install cookie-parser
const app = express(); //app has access to all the properties of express
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); //requiring express layouts, npm install express-ejs-layouts
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/paspport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware'); //scss middleware
const flash = require('connect-flash'); //connect-flash for flash notifications
const customMWare = require('./config/middleware');
//setting up chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log(`Chat server is running on port: 5000`);
app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : '/css'
}));
app.use(express.urlencoded());
app.use(cookieParser()); //using cookie parser
app.use(express.static('./assets'));
//make the uplads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(expressLayouts);
//extract styles and scripts from subpages into layout.ejs file
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Used to generate the session cookie
//mongo store is used to store the session cookie in the db, npm install connect-mongo
app.use(session({
    name : 'codeial', //cookie name
    //TODO Change the secret before deployment
    secret : 'blahsomething', //encryption key
    saveUninitialized: false, //when user is not logged in no data is saved in cookie
    resave: false, //we do not want to rewrite session cookie if it is not changed
    cookie: {
        maxAge : (1000*60*60) //age of the cookie in miliseconds
    },
    store : MongoStore.create(
        {
            mongoUrl : 'mongodb://localhost/codeial_development',
        },
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMWare.setFlash);
//using express router to route files
app.use('/', require('./routes/index'));

app.listen(port, function(err){
    //app is listening on port 8000
    if(err){
        //error in running the server
        console.log(`Error ${err} occured while running the server!`);
        return;
    }
    console.log(`Server is up and running on port ${port}`);
});