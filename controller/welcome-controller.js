router = require('express').Router();
userservice = require('../service/login-service');


router.get('/', (req,res,next)=>{res.json('inside welcome')});



module.exports = router;