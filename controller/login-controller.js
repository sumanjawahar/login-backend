router = require('express').Router();
userservice = require('../service/login-service');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var config = require('../config.json');


router.post('/', loginUser);


module.exports = router;

function loginUser(req,res,next){
    //console.log('inside login user controller',req.body.name);
   // res.json('success');
   let data = {
       name: req.body.name
   }
   userservice.getUserdata(data)
   .then(function(userdata){
       //console.log(userdata.length);
       //console.log(done);
       if(userdata.length != 0 ){
           if(userdata[0].verification == true){

             // console.log('user is there',userdata[0].password);
                // console.log( bcrypt.compareSync(req.body.password, userdata[0].password));
                if( bcrypt.compareSync(req.body.password, userdata[0].password)){
                    // console.log('password matched');

                         
                        res.json({status:'success', message :'password matched',jwt : {name: userdata[0].name, token: jwt.sign({ name: userdata[0].name}, config.secret)}});
                    }
                    else{
                        // console.log('user is available but password mismatch');
                        res.json({status:'failure', message :'password mismatched'});
                        
                    }

           }
           else{
               res.json({status:'failure', message:'verification is false'})
           }
                
               

       }
       else{
         //  console.log('no user is availabe');
           res.json({status:'failure', message :'no user availabe'});
       }


   })
   .catch(function(error){
       console.log(error);

   })
  

}
