const express = require('express');
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
let jwt_decode = require('jwt-decode');
var app = express();
app.use(express.json())
app.use(cookieParser());                             
app.use(bodyParser.json());
var connct = mysql.createConnection({
   "host":"localhost",
   "user":"root",
   "password":"Nav@gur1",
   "database":"loginsignup"
});
connct.connect(function(err){
   if(err) throw err;
   console.log("connected");
});
app.get("/user",(req,res)=>{
   let token = req.headers.authorization;
   // console.log(token)
   if(token && token.startsWith('Bearer ')){
      // console.log(token.length)
         token = token.slice(11, 212)
         // console.log(token)
      if(token){
          try{
            let decoded = jwt.decode(token, "secret");
            req.decoded = decoded;
            res.status(200).send("token is valid");
            // console.log(decoded)
          }catch(err){
              res.status(403).send({
                  success:false,
                  message:err
              })
          }
      }else{
          return res.status(403).json({
              success:false,
              message:'Unauthorized'
          })
      }
  };
});
// here we are using post(req) with it we are getting our data on tereminal
// with get (res) we are showing our data to client
app.post("/register",(req,res)=>{
   //  console.log(req.body.email)
   try{
        const Myobject = {name:req.body.name,
            email:req.body.email,
            her_password:req.body.password
        };
            var insertData ="INSERT INTO data(name,email,password) VALUE?";
            var value = [[Myobject.name,Myobject.email,Myobject.her_password]];
            connct.query(insertData,[value],function(err){
            if (err) throw err;
            res.send("you signup sucessfully: ");
            });
   }catch (error){
        res.send("404 error")
   };
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXRpa2ExMjNAZ21haWwuY29tIiwicGFzc3dvcmQiOiJrcml0aWthMTIz
// JEciLCJpYXQiOjE2MjUzNjAyNjIsImV4cCI6MTYyNTM2Mzg2Mn0.fzEz4I8hZk25LkJFG95e-mzQLZCAPBn8d_0Nb3pLpA4
app.post("/login",(req,res)=>{
   try{
    const Myobject = {name:req.body.name,
        email:req.body.email,
        her_password:req.body.password
     };
    const name = Myobject.name;
    const password = Myobject.her_password;
    const email = Myobject.email
    connct.query(`select * from data where name='${Myobject.name}' and password='${Myobject.her_password}'`,function(err,result){
        if(err) throw err;
        if (result < 0) {
            res.status(404).json({
               message:"Auth Failed"
            });
        }else {
            if(result){
            var token = jwt.sign({email,password},"secret",
               {
                  expiresIn:"1h"
               });
            res.cookie("jwt",token).json({
               message:"user found",
               token:token
            });
            }else{
               res.status(404).json({
                  message:"Failed",
               });
            };
        };
    });
   }catch(error){
       res.status("404").send(`invalid signup ${error}`);
   };
});
app.listen(8000,(err)=>{
   if(err){
      console.log(err);
   };
   console.log("listning");
});
