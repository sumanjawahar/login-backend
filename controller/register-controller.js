router = require('express').Router();
userservice = require('../service/login-service');
const uuidv1 = require('uuid/v1');
var bcrypt = require('bcryptjs');
var url = require('url');

router.post('/', registerUser);


module.exports = router;



// registerUser function To register a new user
function registerUser(req,res,next){
    //console.log(req.headers.host);


    // checking the user already exits in the db
    userservice.checkUser(req.body.name)
    .then(function(count){
        //console.log(count);

        // Enters if no user exists already
        if(count==0){

            var verifytoken = uuidv1();  //  creates random verfication token

            var salt = bcrypt.genSaltSync(10);          // salt for hash
            var hash = bcrypt.hashSync(req.body.password, salt);  // hash to be stored in db
            //hashtest = bcrypt.hashSync('prakash1', salt);
           // console.log(hashtest);
            let userdata = {
                name:req.body.name,
                password:hash,
                verification:false,
                createdtime:new Date()
            }

            //console.log('hash', userdata.password,req.body.password);
           // console.log(bcrypt.compareSync(req.body.password, userdata.password));  //** for checking the password during login
                userservice.registerUser(userdata)
                .then(function(inserteddata){
                    userservice.validation(inserteddata,verifytoken)
                        .then(function(validationdata){

                            sendMail(validationdata,req);
                           // console.log(validationdata);

                            res.status(200).json({status : "success", message: "user registered successfully"});
                        })
                        .catch(function(err){
                            console.log(err);
                        })

                })
                .catch(function(err){
                    console.log(err);
                })
        }
        else
            res.status(200).json({status : "failure", message: "user already exists"});

    })
    .catch(function(err){
    console.log('inside register controller',err);
    })

}

function sendMail(validatedata,req){
    console.log('from send mail',   req);
    let token = validatedata.ops[0]. verificationtoken;
  /*  let fullpath = url.format({
        //protocol:req.protocol,
        host:req.rawHeaders[9],
        pathname:'/verify/'+token
    })*/
  //  console.log(fullpath);
let fullpath = 'http://localhost:4200/verify/'+token;
   let username = validatedata.ops[0].name;

  // let urlpath = url+'/verify/'+token;

   userservice.sendMail(username,fullpath)
        .then(function(done){
            console.log('mail sent');
        })
        .catch(function(error){
            console.log(error);

        })

}
