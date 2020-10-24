const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const browseRouter = express.Router()


browseRouter.get('/browse',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    const searchSpecifications = {
        game: `fields age_ratings.*,first_release_date,total_rating,name,aggregated_rating,genres.*,cover.*; limit 7; sort rating desc;`,
        companies: `fields *,logo.*; limit 7; sort rating desc;`,
        character: `fields akas,checksum,country_name,created_at,description,games.*,gender,mug_shot.*,name,slug,species,updated_at,url; limit 7; sort rating desc;`,
        platform: `fields abbreviation,alternative_name,category,created_at,generation,name,platform_family.*,slug,versions.*; where (category != (2,6) & generation >6 & id < 180 & id != (72,137)); sort generation desc; limit: 5;`,
        genres: `fields *; sort rating desc;`,
        themes: `fields *; sort rating desc;`,
    }
    const basicHeaders = {
        'Accept': 'application/json',
        'Client-ID': config.IDGB.CD ,
        'Authorization': `Bearer ${config.IDGB.AT}`,

    }


    async function fetchData() {
        const gamesCall = await axios.post('https://api.igdb.com/v4/games', searchSpecifications.game, {headers: basicHeaders})
        const companyCall = await axios.post(`https://api.igdb.com/v4/companies`, searchSpecifications.companies, {headers: basicHeaders})
        const characterCall = await axios.post('https://api.igdb.com/v4/characters', searchSpecifications.character, {headers: basicHeaders})
        const platformCall = await axios.post('https://api.igdb.com/v4/platforms', searchSpecifications.platform, {headers:basicHeaders})
        const themeCall = await axios.post('https://api.igdb.com/v4/themes', searchSpecifications.themes, {headers:basicHeaders})
        const genreCall = await axios.post('https://api.igdb.com/v4/genres', searchSpecifications.genres, {headers:basicHeaders})
        

        let callTotal = []
        let platformTotal = []

        console.log(platformTotal)
        callTotal.push({
            platforms: platformCall.data,
            games: gamesCall.data,
            companies: companyCall.data,
            characters: characterCall.data,
            themes: themeCall.data,
            genres: genreCall.data,
            platformGame: platformGameCall.data
        })

        res.send(callTotal)
    }
    fetchData()
},[])


browseRouter.get('/rawg',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    const searchSpecifications = {
        game: `fields age_ratings.*,first_release_date,total_rating,name,aggregated_rating,genres.*,cover.*; limit 7; sort rating desc;`,
        companies: `fields *,logo.*; limit 7; sort rating desc;`,
        character: `fields akas,checksum,country_name,created_at,description,games.*,gender,mug_shot.*,name,slug,species,updated_at,url; limit 7; sort rating desc;`,
        genres: `fields *; sort rating desc;`,
        themes: `fields *; sort rating desc;`,
        platformVersion: `fields *; sort date desc; limit: 100;`

    }
    const basicHeaders = {
        'Accept': 'application/json',
        'Client-ID': config.IDGB.CD ,
        'Authorization': `Bearer ${config.IDGB.AT}`,

    }


    async function fetchData() {

        let callTotal = []

        callTotal.push({

            platforms: platformCall.data,
        })

        res.send(callTotal)
    }
    fetchData()
},[])


module.exports = browseRouter;