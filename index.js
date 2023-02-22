const express = require('express')
const path = require('path')
const router = require('./routes/userRoutes')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const session = require('express-session')
const app = express()
const port = 3000


const URL = 'mongodb://bhavikpr:HIpoVHHYoNA6H4DvWrNe85@15.206.7.200:28017/bhavikpr?authMechanism=DEFAULT&authSource=admin'
mongoose.connect(URL)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

    

//configuration
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(cookieparser())
app.use(session({ secret: "secretpass" }));

app.use('/',router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))