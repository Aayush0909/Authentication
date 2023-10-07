//jshint esversion:6
import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { configDotenv } from 'dotenv';

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
const User = mongoose.model("user",userSchema);

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",(req,res)=>{
    const newEntry = new User({
        email : req.body.username,
        password : req.body.password,
    });
    newEntry.save();
    res.render("secrets.ejs");

});

app.post("/login",async(req,res)=>{
   const username =  req.body.username;
   const password =  req.body.password; 
   const item = await User.findOne({email :username, password : password});
   if(!item){
    console.log("entered email & password is not registred");
   }
   else{
    res.render("secrets.ejs");
   }
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
