const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const companyRouter = express.Router()


companyRouter.post(`/companies/id`, (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    axios({
        url: "https://api.igdb.com/v4/companies/",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data:`fields *,developed.*,logo.*,parent.*,developed.*,developed.cover.*,published.screenshots.url,developed.screenshots.url,developed.genres.name,published.*,published.genres.name,published.cover.*,websites.*; where id = ${req.body.companyId} ;`
    },[])
        .then(response =>{
            const dataResponse = response.data
            res.send(dataResponse)


        })

        .catch(err => {
            console.error(err);
        });
})






module.exports = companyRouter

