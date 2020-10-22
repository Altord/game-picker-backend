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
        character: `fields akas,checksum,country_name,created_at,description,games.*,gender,mug_shot.*,name,slug,species,updated_at,url; limit 7; search "${searchValue}"; `,

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
        let callTotal = []

        callTotal.push({
            games: gamesCall.data,
            companies: companyCall.data,
            characters: characterCall.data,

        })

        res.send(callTotal)
    }
   fetchData()
},[])

module.exports = searchRouter
