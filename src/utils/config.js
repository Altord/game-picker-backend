require('dotenv').config()

// Setting PORT and MONGODB for other applications
let PORT = process.env.PORT

let IDGB = {
    CD: process.env.CID ,
    CS: process.env.CSEC,
    AT: process.env.AUTH
}

let GS = {
    GSKEY: process.env.GSID
}

let RAWG = {
    RAWGKEY: process.env.RAWG
}
module.exports = {
    PORT,
    IDGB,
    GS,
    RAWG
}

