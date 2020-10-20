const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const searchRouter = express.Router()
const printAverageColor = require("../utils/average-color").printAverageColor;

searchRouter.post('/search', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    searchValue = req.body.searchValue.value
    console.log(searchValue)
    const searchSpecifications = {
        game: `fields *; search "${searchValue}"; limit 10;`,
        companies: `fields *,logo.*; where name ~ "${searchValue}"*; limit 10;`,
        character: `fields *,mug_shot.*; search "${searchValue}";  limit 10;`,
        themes: `fields *; where name ~ "${searchValue}"*; limit 10;`,
        franchise: `fields *; where name ~"${searchValue}"*; limit 10;`,
        platform: `fields *;  search "${searchValue}";   limit 10;`,
    }
    const basicHeaders = {
        'Accept': 'application/json',
        'Client-ID': config.IDGB.CD ,
        'Authorization': `Bearer ${config.IDGB.AT}`,

    }


    async function fetchData() {
        const gamesCall = await axios.post('https://api.igdb.com/v4/search', searchSpecifications.game, {headers: basicHeaders})
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
