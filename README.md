# Game Picker 

Backend portion of app that utilizes react, scss and react-router. 

Multiple other libraries are used but mostly for aesthetic purposes.


A basic website, I'm hosting the entire website on heroku, the files for both the backend and front are being placed seperately on github.

This is a personal project for me to somewhat understand how I should be building a website.

There are a decent amount of issues that could be ironed out, but I want to study more while focusing my efforts on something that will benefit my knowledge and then go back to this project in the future.


## Viewing/utilizing the app


I'm assuming anyone who ends up looking at this uses WSL or linux themselves so NPM has probably been previously installed.

The files in this branch will be using localhost:3001 as the server address, the one I upload to heroku will be different.

#### Installing

This part can be run by itself, the front end requires this backend or connecting to the heroku in order to run.

1. Clone the repo.

        git clone https://github.com/Altord/game-picker-backend.git
2. Install it inside whichever directory you so please
3. Use npm run dev

## Built with 
* Node.js - as the runtime
* MongoDB - as the database
* Express - as the middleware
* dotenv - for config files
* passPortJS - for authorization
* jwtToken+Auth - for authorization
## What needs to be done
* Proper commenting
* Clean and organize the code
* **Fix browse**, it's slow as hell because of the async function in the backend
* Switch authorization methods, backend JWT is NOT secure
* Fix guest log in - cors error
