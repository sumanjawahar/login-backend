var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/login", {native_parser: true});

var Q = require('q');
db.bind('logintable');
db.bind('validation');

var nodemailer = require('nodemailer');


services = {};

module.exports = services;

services.registerUser = registerUser;
services.checkUser = checkUser;
services.validation = validation;
services.sendMail = sendMail;
services.findByToken = findByToken;
services.changeStatus = changeStatus;
services.getUserdata = getUserdata;


//var validatedata = { };

// function to add new user data into the db
function registerUser(userdata){
 
    //console.log('inside add user services');
    let defered = new Q.defer(); 
    console.log('inside registeruser services');
   
    db.logintable.insert(userdata, function(err, done){
        //console.log(token);
       // validation(userdata.name,token); //function that adds name and verification token in sep collection
       
        if(err) defered.reject(err);
        defered.resolve(done);
    });
    return defered.promise;
}


//function to check wheather the user is present in db 
function checkUser(username){
    
    let defered = new Q.defer();
    //console.log('inside check user',userid);
    let data = {
        name: username
    }
   // console.log(data);
    db.logintable.find(data).count(function(err,count){
        if(err) defered.reject(err);
        defered.resolve(count); 
    });
    
    return defered.promise;

}

function validation(name,verfitoken){
    let defered = new Q.defer();

   // console.log('======>',name.ops[0],verfitoken);
    var validatedata = {
        name: name.ops[0].name,//extract name from the returned obj
        verificationtoken:verfitoken,
        createdAt: new Date()
    }
  // console.log('validation data =====>',validatedata);
    db.validation.insert(validatedata, function(err, done){
        console.log('validation-----------',done);
        if(err) defered.reject(err);
        defered.resolve(done); 

    });

    return defered.promise;
  

}


function sendMail(username,urlpath){

    let defered = new Q.defer();
   console.log('sendmail',username,urlpath);


   
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'sumanjawahar053@gmail.com', // generated ethereal user
                pass:'8883932216'  // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'sumanjawahar053@gmail.com', // sender address
            to: username, // list of receivers ** to be replaced with username
            subject: 'Hello ✔', // Subject line
            text: urlpath,
            //html: '<p> click here </p>'
        };


    transporter.sendMail(mailOptions, function(err, info){
        if(err) defered.reject(err);
        defered.resolve(info);
    });

    return defered.promise;
    

}

function findByToken(token){

    console.log('from find by token', token); 
    let defered = new Q.defer();

    db.validation.find(token).toArray( function(err, done){
       // console.log('validation-----------',done);
        if(err) defered.reject(err);
        
        defered.resolve(done); 

    });

    return defered.promise;
  
}

function changeStatus(username){

    console.log('from change status', username); 
    let defered = new Q.defer();

    db.logintable.update( username, {$set:{verification:true}}, function(err, done){
       // console.log('validation-----------',done);
        if(err) defered.reject(err);
        
        defered.resolve(done); 

    });

    return defered.promise;

}

function getUserdata(name){
    let defered = new Q.defer();
    
        db.logintable.find(name).toArray( function(err, done){
           // console.log('validation-----------',done);
            if(err) defered.reject(err);
            
            defered.resolve(done); 
    
        });
    
        return defered.promise;
}



