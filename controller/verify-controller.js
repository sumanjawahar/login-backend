router = require('express').Router();
userservice = require('../service/login-service');


router.get('/:token', verifyUser);



module.exports = router;

console.log('inside verify controller');
 
function verifyUser(req,res,next){
    console.log('inside verify controller');   
   // console.log(req.params.token);
   // res.send('success');

   findtoken = {
    verificationtoken:req.params.token
   }
   //undefined .length === 0 .keys.length === 0 null
    userservice.findByToken(findtoken)

    .then(function(done){
          console.log('reulst----------',typeof done);

    
        if( done.length === 0){
            console.log('data not found');
           res.json({status:'faliure', message:'validation token not found'});
            

      
      }
        else{
            console.log('retrived data',done);
          //  updatetoken(done);
           // res.json({status:'success', message:'validation token found'});
           let username = {
            name: done[0].name
        }
       // console.log('from updatetoken=============',username);
       userservice.changeStatus(username)
        .then(function(success){
            console.log('value modified',success);
            res.json({status:'success', message:'validation token found  &&  verification field is updated to true'});
        })
        .catch(function(error){
            console.log(error);
    
        })  
    
        }
            

    })
    .catch(function(error){
        console.log(error);

    })  

}


/*

function updatetoken(userdata){

    let username = {
        name: userdata[0].name
    }
   // console.log('from updatetoken=============',username);
   userservice.changeStatus(username)
    .then(function(done){
        console.log('value modified',done);
        res.json({status:'success', message:'validation token not found  &&  verification field is updated to true'});
    })
    .catch(function(error){
        console.log(error);

    })  

}

*/