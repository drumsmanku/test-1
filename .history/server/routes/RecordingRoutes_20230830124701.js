const express = require('express');
const router = express.Router();
const dotenv=require('dotenv');
const Recording = require('../models/Recording');

dotenv.config()

router.post('/recording/start', async(req, res)=>{
  const startRecording= new Recording({
    userId:req.body.userId,
    status:'recording',
    startedAt:Date.now(),
    videoPermission:req.body.videoPermission,
    audioPermission:req.body.audioPermission
  });
  await startRecording.save();
  res.send(startRecording);
});

router.post('/recording/stop', async(req, res)=>{
  let stopRecording = await Recording.findOne({userId:req.body.userId, status:'recording'});
  if(stopRecording){
    stopRecording.status='stopped';
    await stopRecording.save();
    res.send(stopRecording);
  }
  else{
    res.send({error:'no recording found'});
  }
});

module.exports=router;