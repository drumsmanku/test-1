const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordingSchema= new Schema({
  userId:{type: Schema.Types.ObjectId, ref:'User'},
  status:{type:String, enum:['recording', 'stopped'], default:'stopped'},
  startedAt:{type:Date, default:Date.now},
  videoPermission:{type:Boolean, default:false},
  audioPermission:{type:Boolean, default:false}
});
module.exports=mongoose.model('Recording', RecordingSchema);