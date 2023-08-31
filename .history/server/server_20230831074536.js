const express= require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors');

const app = express();

dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/',(req, res)=>{
  res.send('success')
})

const authenticationRoutes = require('./routes/AuthenticationRoutes');
const recordingRoutes = require('./routes/RecordingRoutes');
app.use(authenticationRoutes);
app.use(recordingRoutes);

app.listen(process.env.PORT, ()=>{
  mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('listening on port ' + process.env.PORT)
  }).catch(err=>console.log(err))
})