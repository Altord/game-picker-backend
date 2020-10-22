const express = require('express')
const app = express()
const path = require('path');
var cors = require('cors')
const apiRouter = require('./src/routes/api-calls')
const gameRouter = require('./src/routes/game')
const searchRouter = require('./src/routes/general-search')
const companyRouter = require('./src/routes/company')
const middleware = require('./src/utils/middleware')
const logger = require('./src/utils/logger')

logger.info('connecting to INSERT MONGODB HERE')

//mongoose.connect goes here
//app.use(cors())s




app.use(express.static('frontend'))
app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)
app.use(apiRouter)
app.use(gameRouter)
app.use(searchRouter)
app.use(companyRouter)
//Fallback routing in case entry is unrecognized
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app