const express = require('express');
const router = express.Router();
const dotenv=require('dotenv');
const Recording = require('../models/Recording');

dotenv.config()

router.post('/recording/start', async(req, res) => {
  const startRecording = new Recording({
    status: 'recording',
    startedAt: Date.now(),
    videoPermission: req.body.videoPermission,
    audioPermission: req.body.audioPermission,
    screenPermission: req.body.screenPermission    
  });
  await startRecording.save();
  res.send(startRecording);
});

router.post('/recording/stop', async(req, res) => {
  let stopRecording = await Recording.findOne({status:'recording'});
  if(stopRecording) {
    stopRecording.status='stopped';
    stopRecording.videoPermission=false;
    stopRecording.audioPermission=false;
    stopRecording.screenPermission=false;    
    await stopRecording.save();
    res.send(stopRecording);
  } else {
    res.send({error:'no recording found'});
  }
});

module.exports=router;