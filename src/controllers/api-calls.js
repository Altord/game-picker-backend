const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const apiRouter = express.Router()


const today = new Date()
const date1 = (new Date().setDate(today.getDate()))/1000
const date60 = (new Date().setDate(today.getDate()-60))/1000
const date14 = (new Date().setDate(today.getDate()-14))/1000
const roundedDate60 = Math.round(date60)
const roundedDate14 = Math.round(date14)
const roundedDate1 = Math.round(date1)

//Basic Search function
apiRouter.post('/api-router-search', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields id,name,platforms.*,genres.*,aggregated_rating,cover.*; search "${req.body.searchValue}"; limit 1;`
    },[])
        .then(response => {
            res.send(response.data)
           // console.log(response.data)
        })

        .catch(err => {
            console.error(err);
        });

})

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
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*; where first_release_date > ${roundedDate60} & rating>= 70 & aggregated_rating >=80 & hypes >= 1 ; limit: 7; sort aggregated_rating asc;`
    })
        .then(response => {
            res.send(response.data)
            //console.log(response.data)

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
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*; where release_dates.date > ${roundedDate14}; limit: 7; sort hypes asc;`
    })
        .then(response => {
            res.send(response.data)
           // console.log(response.data)
        })

        .catch(err => {
            console.error(err);
        });

})

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
        data: `fields game.cover.*,game.*; where date <= ${roundedDate1} & human != "TBD"; limit 16; sort date desc;`
    })
        .then(response => {
            const uniqueNames = new Set();
            const uniqueGames = response.data.filter(entry => {
                const {name} = entry.game;
                if (uniqueNames.has(name)) {
                    return false;
                }
                uniqueNames.add(name);
                return true;
            })


            res.send(uniqueGames)

        })

        .catch(err => {
            console.error(err);
        });
})

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
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,status,release_dates.*; where release_dates.date >= ${roundedDate14};`
    })
        .then(response => {
            res.send(response.data)
            //console.log(response.data)
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
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,status,release_dates.*; where release_dates.date >= ${roundedDate14};`
    })
        .then(response => {
            res.send(response.data)
            //console.log(response.data)
        })

        .catch(err => {
            console.error(err);
        });
})


























//Auth is currently retrieved and only temporarily saved when I'm on the twitch - auth page
//I'll leave this for now but I might just use MONGODB to save the auth token and then return it later
/*apiRouter.get('/twitch-auth', (req, res, next) => {
    res.send('hello')
    axios.request({
        url: `https://id.twitch.tv/oauth2/token?client_id=${config.IDGB.CD}&client_secret=${config.IDGB.CS}&grant_type=client_credentials`,
        method: "post",
    })
        .then((response)=>
        {authToken = response.data
        return authToken.access_data})
        .catch(error => (console.log(error)) )
    console.log(authToken)

});
*/


module.exports = apiRouter


