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
  let stopRecording = await Recording.findById(req.body.recordingId);
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


router.post('/recording/savewebcam', async (req, res) => {
  let recording = await Recording.findById(req.body.recordingId);
  if (recording) {
    recording.webcamVideoUrl = req.body.videoUrl;
    await recording.save();
    res.send(recording);
  } else {
    res.send({ error: 'no recording found' });
  }
});
router.post('/recording/savescreen', async (req, res) => {
  let recording = await Recording.findById(req.body.recordingId);
  if (recording) {
    recording.screenVideoUrl = req.body.videoUrl;
    await recording.save();
    res.send(recording);
  } else {
    res.send({ error: 'no recording found' });
  }
});

router.get('/recording/webcamdata', async(req, res)=>{
  let webcamRecording=await Recording.findById(req.body.recordingId);
  if(webcamRecording){
    res.send(webcamRecording.webcamVideoUrl);
  }else {
    res.send({ error: 'no recording found' });
  }
});
router.get('/recording/screendata', async(req, res)=>{
  let screenRecording=await Recording.findById(req.body.recordingId);
  if(screenRecording){
    res.send(screenRecording.screenVideoUrl);
  }else {
    res.send({ error: 'no recording found' });
  }
});

module.exports=router;