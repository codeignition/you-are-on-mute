require('dotenv').config()
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')
var express = require('express');
var cookieParser = require('cookie-parser');

const cookie = require('cookie');
const request = require('request')
var path = require('path');
var app = express();

var server = require('http').Server(app);
app.use(bodyParser.json(), cors())
app.options('*', cors());
app.use(express.static('public'))
app.use(cookieParser());

server.listen(process.env.PORT || 8080, function () {
    console.log(`Listening on ${server.address().port}`);
});

app.get('/ping', (req, res) => res.send('pong'));

app.post('/signature', (req, res) => {

    const timestamp = new Date().getTime() - 30000
    const msg = Buffer.from(process.env.API_KEY + req.body.meetingNumber + timestamp + req.body.role).toString('base64')
    const hash = crypto.createHmac('sha256', process.env.API_SECRET).update(msg).digest('base64')
    const signature = Buffer.from(`${process.env.API_KEY}.${req.body.meetingNumber}.${timestamp}.${req.body.role}.${hash}`).toString('base64')

    res.json({
        signature: signature
    })
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname + '/login.html'));
});


app.get('/redirect', (req, res) => {

    if (req.query.code) {

        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.REDIRECT_URL;

        request.post(url, (error, response, body) => {

            // Parse response to JSON
            body = JSON.parse(body);

            // Logs your access and refresh tokens in the browser
            console.log(`access_token: ${body.access_token}`);
            console.log(`refresh_token: ${body.refresh_token}`);

            if (body.access_token) {
                console.log(body);
                res.cookie('access_token', body.access_token, {maxAge: 1800000, httpOnly: true});

                request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
                    if (error) {
                        console.log('API Response Error: ', error)
                    } else {
                        body = JSON.parse(body);
                        // Display response in console
                        console.log('API call ', body);
                        //res.cookie('user_id', body.access_token, {maxAge: 9000000});
                        res.redirect('/')

                    }
                }).auth(null, null, true, body.access_token);


            } else {
                // Handle errors, something's gone wrong!
                console.error(body);
                res.send('token set failed');
            }

        }).auth(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

        return;

    }
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.CLIENT_ID + '&redirect_uri=' + process.env.REDIRECT_URL)
});


app.post('/meetings', (req, res) => {

    if(req.cookies.access_token) {
        console.log(req.cookies);

        let url = 'https://api.zoom.us/v2/users/me/meetings';
        let data = {
            topic: "Zoom Meeting",
            type: 2,
            settings: {
                join_before_host: true
            },
            password: "12345678-a"
        };
        request.post(url, {json: data}, (error, response, body) => {
            if (error) {
                console.log('API Response Error: ', error);
                res.status(400).send(error);
            } else {
                console.log(body);
                console.log(response);
                res.status(200).send(body);
            }


        }).auth(null, null, true, req.cookies.access_token);
    }else {
        res.status(401).send('noauth');
    }
});
