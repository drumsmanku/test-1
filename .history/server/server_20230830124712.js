const express= require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors');

const app = express();

dotenv.cauthenticationRoutes
app.use(bodyParser.json());
app.use(cors());

const authenticationRoutes = require('./routes/AuthenticationRoutes');
const recordingRoutes = require('./routes/RecordingRoutes');
app.use(authenticationRoutes);
app.use(recordingRoutes);

app.listen(process.env.PORT, ()=>{
  mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('listening on port ' + process.env.PORT)
  }).catch(err=>console.log(err))
})