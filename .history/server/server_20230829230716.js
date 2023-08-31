const express= require('express');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors');
const authRoutes = require('./routes/auth')

const app = express();

dotenv.config();
app.use(bodyParser.json());
app.use(cors());


app.listen(process.env.PORT, ()=>{
  mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('listening on port ' + process.env.PORT)
  }).catch(err=>console.log(err))
})