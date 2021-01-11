const express = require('express');
const bodyParser = require('body-parser');
const app = require('./app.js');
const socket = require('./bin/www');

// pembuatan App Express
//const app = express();

// memparse reques content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// memparse reques of content-type - application/json
app.use(bodyParser.json())


// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

const dbConfig = require('./config/db.js');
console.log(`${dbConfig.url} tess`);

const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

// koneksi Ke Database
mongoose.connect(dbConfig.url, dbConfig.options )
.then(() => {
    console.log("Successfully Sekarang Anda Terkonek Ke database");    
}).catch(err => {
	console.log(err);
    console.log('Error database Tidak Terkoneksi atau Tidak Ada');
    process.exit();
});
