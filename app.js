var express = require('express');


var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var router = require('./routes/apis/index');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();



app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods" ,"GET, POST, PUT, DELETE, PATCH, OPTIONS");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.header("Access-Control-Allow-Headers", "Content-Type, Authorisation");
    res.header("Access-Control-Allow-Headers", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials",true);
    next();
/*
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
*/




});

const nocache = require('nocache');

app.use(nocache());

app.use('/', router);
//app.use('/users', usersRouter);


module.exports = app;
