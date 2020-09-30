require('dotenv').config()

// Setting PORT and MONGODB for other applications
let PORT = process.env.PORT

let IDGB = {
    CD: process.env.CID ,
    CS: process.env.CSEC,
    AT: process.env.AUTH
}

module.exports = {
    PORT,
    IDGB
}

