const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, (err) => {
    if(err){
        return logger.info('Somethings iffy here',err)
    }
    logger.info(`Server running on port ${config.PORT}`)
})