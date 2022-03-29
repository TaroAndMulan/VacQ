const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss= require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

dotenv.config({path:'./config/config.env'});

connectDB();

const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth')
const appointments = require('./routes/appointments');

const app = express();
//add cookie parse
app.use(cookieParser());

// add body parse
app.use(express.json());
//sanitize data
app.use(mongoSanitize());

// set security header
app.use(helmet());

//xss
app.use(xss());


const limiter = rateLimit({
    windowsMs:10*60*1000, // 10mins
    max:5
});

app.use(limiter);

app.use(hpp());

app.use(cors());


app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth)
app.use('/api/v1/appointments',appointments);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, ' mode on port ', PORT));
 
process.on('handlesRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
})