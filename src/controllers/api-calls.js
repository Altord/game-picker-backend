const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const apiRouter = express.Router()
const printAverageColor = require("../utils/average-color").printAverageColor;
const googleTrends = require('google-trends-api')

const today = new Date()
const date1 = (new Date().setDate(today.getDate()))/1000
const date60 = (new Date().setDate(today.getDate()-60))/1000
const date14 = (new Date().setDate(today.getDate()-14))/1000
const date25 = (new Date().setDate(today.getDate()-25))/1000
const roundedDate60 = Math.round(date60)
const roundedDate25 = Math.round(date25)
const roundedDate14 = Math.round(date14)
const roundedDate1 = Math.round(date1)

//Google trends
async function trends (keyword){
     await googleTrends.interestOverTime({keyword: `${keyword}`})
        .then((results)=>{
            JSON.parse(results)

        })
        .catch(function(err){
            console.error('Oh no there was an error', err);
        })
}

//${req.body.searchValue}

//Basic Search function


//Search results for Popularity/first row of categories on the front page
apiRouter.post('/api-router-popularity', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,collection,summary,platforms.*; where first_release_date > ${roundedDate60} & aggregated_rating >=70 & follows>5; limit: 10; sort hypes desc;`
    })
        .then(response =>{
            const dataResponse = response.data
            const colorResponse =
                Promise.all(
                    Array.from({ length: 7 }, (_, idx) =>
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

//Search for most recent/trending games
apiRouter.post('/api-router-trending', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,collection,summary,platforms.*; where first_release_date > ${roundedDate14}; limit: 20;`
    })
        .then(response =>{
            const dataResponse = response.data
            const colorResponse =
                Promise.all(
                    Array.from({ length: 7 }, (_, idx) =>
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
//Search for upcomming games
apiRouter.post('/api-router-soon', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/release_dates",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields game.cover.*,game.*, game.platforms.*, game.genres.*; where date <= ${roundedDate1} & human != "TBD"; limit 30; sort date desc;`
    })
        .then(response => {
            const uniqueNames = new Set();
            const uniqueGames = response.data.filter(entry => {
                const {name} = entry.game;
                if (uniqueNames.has(name) || entry.game.cover === undefined) {
                    return false;
                }
                uniqueNames.add(name);
                return true;
            })


            return(uniqueGames)

        })
        .then(response =>{
            const dataResponse = response
            const colorResponse =
                Promise.all(
                    Array.from({ length: 7 }, (_, idx) =>
                        printAverageColor(response[idx].game.cover.url.replace("//", "https://")
                        )));


            return Promise.all([dataResponse,colorResponse])


        })
        .then(finalRes=>{
            res.send(finalRes)
        })

        .catch(err => {
            console.error('this is a recent games error ' + err);
        });
})
//Search for most anticipated games
apiRouter.post('/api-router-anticipated', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,collection,summary,platforms.*,follows; limit 10; sort follows desc; where (follows != null & first_release_date > ${roundedDate1} );`
    })

        .then(response =>{
            const dataResponse = response.data
            const colorResponse =
                Promise.all(
                    Array.from({ length: 7 }, (_, idx) =>
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


apiRouter.get('/test', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,collection,summary,platforms.*; where first_release_date > ${roundedDate14}; limit: 7;`
    })
        .then(response =>{
           /* const colorResponse =
                Promise.all(Array.from({ length: 7 }, (_, idx) =>
                        printAverageColor(response[idx].game.cover.url.replace("//", "https://")
                ))); */
             const trendResponse =
                Promise.all(Array.from({ length: 7 }, (_, idx) => (
                    googleTrends.interestOverTime({keyword: `${response.data[idx].name}`, startTime: (new Date(+new Date - 12096e5))})
                    .then((results)=>{
                        return JSON.parse(results)
                    })
                    .catch(function(err){
                        console.error('Oh no there was an error', err);
                    }))))

                /*Array.from({ length: 100 }, (_, idx) => */


            return Promise.all([response.data, trendResponse])


        })
        .then(finalRes=>{
            res.send(finalRes)
        })

        .catch(err => {
            console.error(err);
        });
})

apiRouter.post('/api-router-top100', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields name,hypes,aggregated_rating,rating,genres.*,cover.*,collection,summary,platforms.*,first_release_date; where (rating > 80 & aggregated_rating < 99) & follows > 100; limit 10; sort aggregated_rating desc;`
    })
        .then(response =>{
            const dataResponse = response.data
            const colorResponse =
                Promise.all(
                    Array.from({ length: 10 }, (_, idx) =>
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





module.exports = apiRouter
