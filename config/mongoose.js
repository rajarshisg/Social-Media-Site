const mongoose = require('mongoose'); //requiring mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@connecti.lkuxj.mongodb.net/${process.env.DB_NAME}`); //connecting to the database

const db = mongoose.connection; //acquiring the connection

//if any error occured in connecting to mongodb
db.on('error', console.error.bind(console, 'Error occured in connecting to MongoDB!'));

//once mongodb is connected
db.once('open', function () {
    console.log('Succesfully connected to MongoDB!');
});

module.exports = db;