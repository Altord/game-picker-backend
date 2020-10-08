const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const apiRouter = express.Router()
const { createCanvas, loadImage } = require('canvas');
const FastAverageColor = require('fast-average-color');

const today = new Date()
const date1 = (new Date().setDate(today.getDate()))/1000
const date60 = (new Date().setDate(today.getDate()-60))/1000
const date14 = (new Date().setDate(today.getDate()-14))/1000
const roundedDate60 = Math.round(date60)
const roundedDate14 = Math.round(date14)
const roundedDate1 = Math.round(date1)

const fac = new FastAverageColor();

//General insert function

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

//color function
async function printAverageColor(filename) {
    const img = await loadImage(filename);
    const { width, height } = img;

    const canvas =  createCanvas(width, height);
    const ctx =  canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData =  ctx.getImageData(0, 0, width, height);

    let imageColorArray= [
        {SAC:   fac.getColorFromArray4(imageData.data,  { algorithm: 'simple'}) },
        {SQAC:   fac.getColorFromArray4(imageData.data) },
        {DAC:  fac.getColorFromArray4(imageData.data, { algorithm: 'dominant'})}
    ]

    // console.log(`Filename: ${filename}, size: ${width}×${height}`);
    //console.log('// [red, green, blue, opacity]');
    //console.log(imageColorArray)
    return imageColorArray

}


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
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,collection,summary,platforms.*; where first_release_date > ${roundedDate60} & rating>= 70 & aggregated_rating >=80 & hypes >= 1 ; limit: 10; sort hypes desc;`
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
        data: `fields name,hypes,aggregated_rating,genres.*,cover.*,collection,summary,platforms.*; where release_dates.date > ${roundedDate14}; limit: 10; sort hypes asc;`
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
                if (uniqueNames.has(name)) {
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
                if (uniqueNames.has(name)) {
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
            console.error(err);
        });
})

console.log("hi")
module.exports = apiRouter
