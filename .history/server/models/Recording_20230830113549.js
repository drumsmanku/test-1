const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordingSchema= new Schema({
  userId:{type: Schema.Types.ObjectId, ref:'User'},
  status:{type:String, enum:['recording', 'stopped'], default:'stopped'},
});
module.exports=mongoose.model('Recording', RecordingSchema);