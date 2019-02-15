const express = require('express');
const ngrok = require('ngrok');
const path = require('path');

//setup boilerplate
let endpoint = ''
let port = '8088';
const app = express();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/safbc.html')); //serve static html 
});

// run the app server and tunneling service
// const server = app.listen(8088, () => {
//     ngrok.connect(8088).then(ngrokUrl => {
//         endpoint = ngrokUrl
//         console.log(`Your dApp is being served!, open at ${endpoint} and scan the QR to login!`)
//     })
// })
// run just the app server
const server = app.listen(8088, () => {

    console.log(`Your site is being served on port ${port}`)

})