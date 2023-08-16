//jshint esversion:6

//calling this environment variable package as early as possible which will we used to basically keep our secret string hidden
require ('dotenv').config();
const express = require('express');
const ejs = require ('ejs');
const bodyParser= require ('body-parser');
const mongoose = require('mongoose');
const encrypt = require ('mongoose-encryption');

const app= express();
const port =3000;
app.set("view-engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDb",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
// we can use this secret to encrypt our whole document by calling this in schema using plugin and to hide this secret value we use environment variables where inside a hideen .env text file we put our values which we want to be hideen and then call them in our app.js using process.env.NAME

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});
 
const User = mongoose.model ("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.get("/submit",(req,res)=>{
    res.render("submit.ejs");
});

app.post("/register",(req,res)=>{
    const newUser= new User({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save()
    .then(()=>{
        res.render("secrets.ejs");
    })
    .catch((err)=>{
        console.log(err);
    });
});
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
    .then((foundUser)=>{
        if(foundUser.password === password){
            res.render("secrets.ejs");
        };
    }
    )
    .catch((err)=>{
    console.log(err);
});
});


app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})