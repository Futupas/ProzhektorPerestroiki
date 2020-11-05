'use strict';

const express = require('express');
const PORT = process.env.PORT || 5000;

const generateSvg = require('./generate_svg');

const { Server } = require('ws');

const noCacheOptions = {
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
};

let pgp = require('pg-promise')();
let db = pgp(process.env.DATABASE_URL);

const app = express()
.use(express.static('static'))
.use(express.json())
.get('/', (req, res) => {
    let delta = Math.random() * (Math.PI / 16); // about 0..11deg

    let options = {
        windowSize: { width: 1000, height: 1000 },
        shotSize: { width: 'window', height: 'window' },
        siteType: 'html'
    };
    
    db.one(`UPDATE "angle_table" SET "value" = mod(CAST("value" + ${delta} AS NUMERIC), CAST(PI() AS NUMERIC)) WHERE "key" = 0 RETURNING "value"`)
        .then(function (data) {
            var webshot = require('webshot');
            webshot(generateSvg.generateHTMLString(data.value * 1.0), 'static/picture.png', options, function(err) {
                wss.clients.forEach((client) => {
                    client.send('c');
                });
                res.sendFile('static/main.html', noCacheOptions);
            });
        })
        .catch(function (error) {
            console.log('ERROR:', error);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('error ' + error);
        });

})
.get('/ua', (req, res) => { 
    console.log('fff');   
    let delta = Math.random() * (Math.PI / 16); // about 0..11deg

    let options = {
        windowSize: { width: 1000, height: 1000 },
        shotSize: { width: 'window', height: 'window' },
        siteType: 'html'
    };
    
    db.one(`UPDATE "angle_table" SET "value" = mod(CAST("value" + ${delta} AS NUMERIC), CAST(PI() AS NUMERIC)) WHERE "key" = 0 RETURNING "value"`)
        .then(function (data) {
            var webshot = require('webshot');
            webshot(generateSvg.generateHTMLString(data.value * 1.0), 'static/picture.png', options, function(err) {
                wss.clients.forEach((client) => {
                    client.send('c');
                });
                res.sendFile('static/ua.html', noCacheOptions);
            });
        })
        .catch(function (error) {
            console.log('ERROR:', error);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('error ' + error);
        });

})
.get('/keep_active', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('' + Math.random());
})
.post('/monobank_test', (req, res) => {

    console.log(JSON.stringify(req.body));

    res.send(200);
})
.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
} );


const wss = new Server({ server: app });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});
