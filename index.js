var express = require('express');
var app = express();

var server = require('http').Server(app);


server.listen(process.env.PORT || 8080, function () {
    console.log(`Listening on ${server.address().port}`);
});

app.get('/ping', (req, res) => res.send('pong'));
