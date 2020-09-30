const config = require('./src/utils/config')
const express = require('express')
const app = express()
var cors = require('cors')
const apiRouter = require('./src/controllers/api-calls')
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


module.exports = app