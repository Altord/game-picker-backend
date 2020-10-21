const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const searchRouter = express.Router()
const printAverageColor = require("../utils/average-color").printAverageColor;

searchRouter.post('/search', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    searchValue = req.body.searchValue
    const searchSpecifications = {
        game: `fields age_ratings.*,first_release_date,total_rating,name,aggregated_rating,genres.*,cover.*; limit 7; search "${searchValue}";`,
        companies: `fields *,logo.*; limit 7; where name ~ "${searchValue}"*; `,
        character: `fields *,mug_shot.*; limit 7; search "${searchValue}"; `,
        themes: `fields *; limit 7; where name ~ "${searchValue}"*;`,
        franchise: `fields *; limit 7; where name ~"${searchValue}"*;`,
        platform: `fields *; limit 7; search "${searchValue}";  `,
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
        const themeCall = await axios.post(`https://api.igdb.com/v4/themes`, searchSpecifications.themes, {headers: basicHeaders})
        const franchiseCall = await axios.post(`https://api.igdb.com/v4/franchises`, searchSpecifications.franchise, {headers: basicHeaders})
        const platformCall = await axios.post(`https://api.igdb.com/v4/platforms`, searchSpecifications.platform, {headers: basicHeaders})
        let callTotal = []

        callTotal.push({
            games: gamesCall.data,
            companies: companyCall.data,
            characters: characterCall.data,
            themes: themeCall.data,
            franchise: franchiseCall.data,
            platforms: platformCall.data,
        })

        res.send(callTotal)
    }
   fetchData()
},[])

module.exports = searchRouter
