const express = require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const Newuser=require('../models/Newuser');
const bcrypt=require('bcrypt');
const dotenv=require('dotenv');

dotenv.config()

router.post('/register', async(req, res)=>{
  const{name, email, password}=req.body;
  let user=await Newuser.findOne({email});

  if(user){
    res.status(409).send({message:'User already exists, please sign in'});
  }
  else{
    const encryptedPassword=await bcrypt.hash(password, 10);
    user =new Newuser({name, email, password:encryptedPassword});
    await user.save();
    const token =jwt.sign({userId:user.id}, process.env.JWT_SECRET_KEY);
    res.json({status:'success', token, name:user.name});
  }
});

router.post('/login', async(req, res)=>{
  const {email, password} = req.body;
  const user=await Newuser.findOne({email});
  if(!user){
    res.status(404).send({message:'User not found. Please Sign up'});
    return;
  }
  const match= await bcrypt.compare(password, user.password);
  if(match){
    const token =jwt.sign({userId:user.id}, process.env.JWT_SECRET_KEY);
    res.json({message:'User exists. Signed in successfully', token, name:user.name});
  }
  else{
    res.send({message:'Invalid credentials'});
  }
});

module.exports=router;