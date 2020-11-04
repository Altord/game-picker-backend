const gameStatusRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");
const Game = require("../models/game_status")
gameStatusRouter.post('/users/games/status', (req,res,next)=>{
    const gameFinal = req.body.editedGameInfo
    gameFinal.status = req.body.status
    const newGame = new Game({
        gameTitle: gameFinal.gameTitle,
        gameId: gameFinal.gameId,
        score: gameFinal.score,
        status: gameFinal.status
    })
    User.find({_id:req.body.userData.id, games:{$elemMatch: {gameId:gameFinal.gameId}}}).then(user=> {

        if (user[0] === undefined){
            User.updateOne({_id:req.body.userData.id},{$push: {games: newGame}}).then(gameUpdate=>{
                User.find({_id:req.body.userData.id, games:{$elemMatch: {gameId:gameFinal.gameId}}}).then(newUser=>{
                    const finalGames = newUser[0].games
                    const payload = {
                        games: finalGames
                    };// Sign token
                    jwt.sign(
                        payload,
                        config.secretOrKey,
                        {
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                })    
            })
        }else{
            console.log('Game Status Updated')
            User.updateOne({_id:req.body.userData.id, games:{$elemMatch: {gameId:gameFinal.gameId}}}, {$set: {"games.$.status":gameFinal.status}}).then(gameUpdate=>{
                const finalGames = user[0].games
                const payload = {
                    games: finalGames
                };// Sign token
                jwt.sign(
                    payload,
                    config.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );

            })
  
        }

    })
})


module.exports = gameStatusRouter