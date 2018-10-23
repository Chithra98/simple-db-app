const express = require('express');
const router = express.Router();
var users = require('../../../models').user;
var methods = require('../../../methods');
var config = require('../../../config/config.js');
var jwt=require('jsonwebtoken');
var token;
var username;

router.get('/', function(req,res){
    res.status(200).json({
        message : "Success"
    });
})
router.get('/user', function(req,res){
    res.render('index');
})
router.post('/', function(req,res) {
    username = req.body.username;
    users.findOne({where:{
        username:req.body.username} }).then( user => {
            
            if(!user){
          console.log(req.body.username);
                res.send({success:false,message:"Authentication failed"});
            }else
            {
                if(user.verified==false)
                {
                    res.send("Your application has not been verified yet!!");
                }
                else
                {
          console.log(user);
                isMatch=users.comparePassword(req.body.password,user);
    
                    if(isMatch)
                    {
                         token=jwt.sign(user.id,config,{
                            
                            });
                        //res.cookie('jwt',token);
                //res.status(200).send({success: true , token :'JWT ' + token})
                            res.redirect('./signin/me');
                            
    
                    }
                    else
                    {
                        res.send({success:false,message:"passwords did not match"});
                    }
                }
                
            }
    
        }
        );

})
router.get('/me', function(req, res) {

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      methods.usermethods.getUserByUsername(username).then((values) =>{
        console.log(values);
        var val = {
            username : values[0].username,
            lhadmno : values[0].lhadmno,

        }
       
        methods.attmethods(username).then((classes) =>{
            console.log(classes)
            val.attendance = classes 
            res.render('user',{val})
        })
        .catch((err) =>{
            console.log(err)
        })
      }).catch((err) =>{
          console.log(err);
      })
    });
  });

module.exports = router;