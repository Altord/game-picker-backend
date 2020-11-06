const  mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    gameTitle:{type: String, required: true},
    gameId:{type: Number, required: true},
    gameCover:{type: String},
    score:{type: Number},
    status:{type:String}
})


const Game = mongoose.model('gameStatus', gameSchema)

module.exports = Game