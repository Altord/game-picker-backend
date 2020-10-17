const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const gameRouter = express.Router()
const printAverageColor = require("../utils/average-color").printAverageColor;


gameRouter.post(`/games/id`, (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    axios({
        url: "https://api.igdb.com/v4/games/",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields age_ratings.*,artworks.url,summary,first_release_date,total_rating,name,aggregated_rating,involved_companies.publisher,involved_companies.developer,involved_companies.company.*,storyline,themes.name,total_rating,videos.video_id,websites.*, screenshots.*, franchises.name,artworks.*,platforms.*,genres.*,cover.*; where id = ${req.body.gameId};`
    },[])
        .then(response =>{
            const dataResponse = response.data
            const colorResponse =
                Promise.all(
                    Array.from({length: 1}, (_, idx) =>
                        printAverageColor(response.data[idx].cover.url.replace("//", "https://")
                        )));


            return Promise.all([dataResponse,colorResponse])


        })
        .then(color=>{
            res.send(color)
        })

        .catch(err => {
            console.error(err);
        });
})


gameRouter.post(`/games/rec`, (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    let mappedGenre = req.body.genres.map(genre=>genre.id)
    let mappedTheme = (req.body.themes === undefined ? 0 : req.body.themes.map(theme=>theme.id))
    let finalGenre = mappedGenre[Math.floor(Math.random() * mappedGenre.length)]
    let finalTheme = mappedTheme[Math.floor(Math.random() * mappedTheme.length)]
    let finalDec = req.body.themes === undefined ? `genres = (${finalGenre})`  : `themes =(${finalTheme}) & genres = (${finalGenre})`
    console.log(finalGenre, finalTheme)
        axios({
        url: "https://api.igdb.com/v4/games/",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },

        data: `fields age_ratings.*,artworks.url,summary,first_release_date,total_rating,name,aggregated_rating,involved_companies.publisher,involved_companies.developer,involved_companies.company.*,storyline,themes.name,total_rating,videos.video_id,websites.*, screenshots.*, franchises.name,artworks.*,platforms.*,genres.*,cover.*; where ${finalDec} & category !=(1,2,4,5,6,7) & id !=(${req.body.gameName}); limit 20;`
    },[])
        .then(response =>{
            const dataResponse = response.data
            return Promise.all([dataResponse])


        })
        .then(color=>{
            res.send(color)
        })

        .catch(err => {
            console.error(err);
        });
})


module.exports = gameRouter