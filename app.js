const express = require('express')
const app = express()
const path = require('path');
var cors = require('cors')
const apiRouter = require('./src/controllers/api-calls')
const gameRouter = require('./src/controllers/game')
const searchRouter = require('./src/controllers/general-search')
const companyRouter = require('./src/controllers/company')
const browseRouter = require('./src/controllers/browse')
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
app.use(browseRouter)
//Fallback routing in case entry is unrecognized
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/frontend/index.html'));
});

module.exports = app