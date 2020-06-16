'use strict';

const express = require('express');
const PORT = process.env.PORT || 5000;

const generateSvg = require('./generate_svg');

const { Server } = require('ws');

const htmlFile = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Art1 by Futupas</title>
    <style>
*{
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
}

body{
    background-color: #000;
    overflow: hidden;
}

#mainsvg{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 1000px;
    height: 1000px;
    background-color: #000;
    z-index: 2;
}

    </style>
</head>
<body>
    


</body>
</html>
`;


const app = express()
.use(express.static('static'))
.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki');
})
.get('/picture', (req, res) => {

    var options = {
        windowSize: { width: 1000, height: 1000 },
        shotSize: { width: 'window', height: 'window' },
        siteType: 'html'
    };


    var pgp = require('pg-promise')();
    var db = pgp(process.env.DATABASE_URL);

    
    let delta = Math.random() * (Math.PI / 16); // about 0..11deg

    db.one(`UPDATE "angle_table" SET "value" = mod(CAST("value" + ${delta} AS NUMERIC), CAST(PI() AS NUMERIC)) WHERE "key" = 0 RETURNING "value"`)
        .then(function (data) {
            console.log('DATA:', data.value);
            var webshot = require('webshot');
            webshot(htmlFile, 'static/file.png', options, function(err) {
                wss.clients.forEach((client) => {
                    client.send('c');
                });
                res.sendfile('static/file.png');
            });
        })
        .catch(function (error) {
            console.log('ERROR:', error);

            res.writeHead(200, {'Content-Type': 'text/plain'});
        
            res.end('error ' + error);
        });

})
.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
} );


const wss = new Server({ server: app });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
    ws.on('message', function incoming(data) {
        console.log('incoming ws data: ' + data);
        wss.clients.forEach((client) => {
            client.send('someone sent: ' + data);
        });
    });
});
