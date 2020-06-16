'use strict';

const express = require('express');
const PORT = process.env.PORT || 5000;

const generateSvg = require('./generate_svg');

const { Server } = require('ws');


const app = express()
.use(express.static('static'))
.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki');
})
.get('/picture.png', (req, res) => {

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
            var webshot = require('webshot');
            webshot(generateSvg.generateHTMLString(data.value * 1.0), 'static/_private_picture.png', options, function(err) {
                wss.clients.forEach((client) => {
                    client.send('c');
                });
                res.sendfile('static/_private_picture.png');
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
});
