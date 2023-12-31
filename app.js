//jshint esversion:6
import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { configDotenv } from 'dotenv';



const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }//not true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

configDotenv({path:"./.env"});

mongoose.connect(process.env.SECRET_KEY)
.then(()=>console.log("mongoD connected"))
.catch((err)=>console.log(err));
const userSchema = new mongoose.Schema ({
    email:{
        type:String,   
    },
    password : {
        type:String,
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/register",(req,res)=>{
    res.render("register.ejs");
});
app.get("/logout",(req,res)=>{
    req.logOut(function(err){
        if(err){
            console.log(err);
        }
        else{
          res.redirect("/");  
        }
    });
    
});

app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets.ejs");
    }
    else{
        res.redirect("/login")
    }
});

app.post("/register",(req,res)=>{
    User.register({username : req.body.username , active:false}, req.body.password, function(err, user){
        if(err){
         console.log(err);
         res.redirect("/register")
        }
        else{
         passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
         });
        } 
 
     })
});

app.post("/login",async(req,res)=>{
    const user = new User({
    username: req.body.username,
    password: req.body.password, 
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
          passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
    }) ; 
        }
    });
    
    
    
});
  
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
