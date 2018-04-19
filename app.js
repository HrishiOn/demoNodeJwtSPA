const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

//home
app.get('/api',(req,res)=>{
    res.json({
        message:"this is jwt home test: hello world"
    });
});

//jwt implementation
app.post('/api/login',(req,res)=>{
    //mock user: not a good programming practice, but.. hey
    const user={
        id:11,
        username:"thinking_cursor",
        email:"something@something.com"
    }
    jwt.sign({user},'my_secret_key',(err,token)=>{
        res.json({
            token
        });
    });
});

//api to protect
app.post('/api/post',verifytokenMiddleware,(req,res)=>{
    jwt.verify(req.token, 'my_secret_key',(err,auth_data)=>{
        if(err) res.sendStatus(403)
        else{
            res.json({
                message:"protect me",
                auth_data
            });
        }
    });
});

//format of token: baerer <actual token>
//funtion to verify token: middleware is what they call it
function verifytokenMiddleware(req, res, next){
   //get the headers and set the authorization
    const baererHeader = req.headers['authorization'];
    if(typeof baererHeader !== String) {
        //split at the space
        const baerer = baererHeader.split(' ');
        const baererToken = baerer[1];
        req.token = baererToken;
        next; // this is cool, next goes to the NEXT part of the
        //middleware
    }
    res.sendStatus(403);
}

app.listen(3000, ()=>console.log('running on port 3k'));