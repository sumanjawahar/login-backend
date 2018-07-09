const express = require ('express');
const app = express();
var http = require('http');
var bodyParser = require('body-parser');
var expressjwt = require('express-jwt');
var config = require('./config');
var cors = require('cors');
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(expressjwt({ secret: config.secret }).unless({ path: ['/login', '/register'] }));

app.use('/register', require('./controller/register-controller'));
app.use('/verify',  require('./controller/verify-controller'));
app.use('/login', require('./controller/login-controller'));
app.use('/welcome', require('./controller/welcome-controller'));


app.listen(3000, function(){
    console.log('server started');
});
