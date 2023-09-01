const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordingSchema = new Schema({
  status: { type: String, enum: ['recording', 'stopped'], default: 'stopped' },
  startedAt: { type: Date, default: Date.now() },
  videoPermission: { type: Boolean, default: false },
  audioPermission: { type: Boolean, default: false },
  screenPermission: { type: Boolean, default: false },
  webcamVideoUrl: { type: String } ,
  screenVideoUrl: { type: String } 
});

module.exports = mongoose.model('Recording', RecordingSchema);
