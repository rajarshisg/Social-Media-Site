const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codeial_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error occured in connecting to MongoDB!'));

db.once('open', function(){
    console.log('Succesfully connected to MongoDB!');
});

module.exports = db;