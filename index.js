require('dotenv').config()
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')
var express = require('express');
var path = require('path');
var app = express();

var server = require('http').Server(app);
app.use(bodyParser.json(), cors())
app.options('*', cors());
app.use(express.static('public'))

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

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
