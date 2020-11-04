const express = require('express')
const app = express()
const config = require('./src/utils/config')
const path = require('path');
var cors = require('cors')
const bodyParser = require("body-parser")
const apiRouter = require('./src/controllers/api-calls')
const gameRouter = require('./src/controllers/game')
const searchRouter = require('./src/controllers/general-search')
const companyRouter = require('./src/controllers/company')
const browseRouter = require('./src/controllers/browse')
const userRouter = require('./src/controllers/users')
const gameStatusRouter = require('./src/controllers/gameStatusRouter')
const middleware = require('./src/utils/middleware')
const logger = require('./src/utils/logger')
const passport = require('passport')
const mongoose = require('mongoose')

// Passport config
require("./src/utils/passport")(passport);

logger.info('connecting to INSERT MONGODB HERE')



mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })



app.use(express.static('frontend'))
app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Passport middleware
app.use(passport.initialize());
app.use(apiRouter)
app.use(gameRouter)
app.use(searchRouter)
app.use(companyRouter)
app.use(browseRouter)
app.use("/api/users", userRouter);
app.use(gameStatusRouter)



//Fallback routing in case entry is unrecognized
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/frontend/index.html'));
});

module.exports = app