const config = require('../utils/config')
const express = require('express')
const axios = require('axios')
const apiRouter = express.Router()

//Basic Search function
apiRouter.post('/api-router-requests', (req,res) =>{
    res.header("Access-Control-Allow-Origin", "*");
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': config.IDGB.CD ,
            'Authorization': `Bearer ${config.IDGB.AT}`,

        },
        data: `fields name,platforms.*,genres.*,aggregated_rating,cover.*; search "${req.body.searchValue}"; limit 1;`
    })
        .then(response => {
            res.send(response.data)
            console.log(response.data)
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


