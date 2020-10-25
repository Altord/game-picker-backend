const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const browseRouter = express.Router()


browseRouter.post('/browse',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    const searchSpecifications = {
        developers: `fields *,logo.*, developed.*, developed.screenshots.*; where developed > 11 & id != (1,5,8,10,11); limit 5; sort id asc;`,
        publishers: `fields *,logo.*, published.*, published.screenshots.*; where published.rating > 11 & id != 4 ; limit 5; sort id asc;`,
        character: `fields akas,checksum,country_name,created_at,description,games.*,games.screenshots.*,gender,mug_shot.*,name,slug,species,updated_at,url; where games.rating > 80; limit 7; sort id asc;`,
    }
    const basicHeaders = {
        'Accept': 'application/json',
        'Client-ID': config.IDGB.CD ,
        'Authorization': `Bearer ${config.IDGB.AT}`,

    }


    async function fetchData() {
        const develeporCall = await axios.post(`https://api.igdb.com/v4/companies`, searchSpecifications.developers, {headers: basicHeaders})
        const publisherCall = await axios.post(`https://api.igdb.com/v4/companies`, searchSpecifications.publishers, {headers: basicHeaders})
        const genreCall = await axios.get(`https://api.rawg.io/api/genres?key=${config.RAWG.RAWGKEY}`, {headers: {'User-Agent':'Game-Picker'} })
        const platformCall = await axios.get(`https://api.rawg.io/api/platforms?key=${config.RAWG.RAWGKEY}`, {headers: {'User-Agent':'Game-Picker'} })
        let platformArray = []
        let genreArray = []
        platformArray.push(platformCall.data)
        genreArray.push(genreCall.data)
        let gameReplace = {
            3498: 1020,
            4200: 72,
            3328: 1942,
            32: 25657,
            766: 2903,
            5286: 1164,
            5679: 472,
            4062: 538,
            1030:1331,
            3272:11198,
            1879:422,
            802:498,
            13633:54356,
            13910:1318,
            5525:212


        }
        let platformIdReplace={
            4: 6,
            187: 167,
            1: 49,
            18: 48,
            186: 169,

        }
        platformArray[0].results.forEach((result, i)=>{
            if(result.id in platformIdReplace){
              result.id = platformIdReplace[result.id]
            }
            result.games.forEach((game)=> {
                    if (game.id in gameReplace) {
                        game.id = gameReplace[game.id]
                    }
                }
            )}
        )

        genreArray[0].results.forEach((result, i)=>{
            result.games.forEach((game)=> {
                    if (game.id in gameReplace) {
                        game.id = gameReplace[game.id]
                    }
                }
            )}
        )

        let callTotal = []
        callTotal.push({
            platforms: platformArray[0],
            developers: develeporCall.data,
            publishers: publisherCall.data,
            genres: genreArray[0],
       })

        res.send(callTotal)
    }
    fetchData()
},[])


module.exports = browseRouter;