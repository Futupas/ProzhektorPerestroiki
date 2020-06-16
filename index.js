'use strict';

const express = require('express');
const PORT = process.env.PORT || 5000;

const fs = require('fs');

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
.get('/', (req, res) => {
    res.sendfile('static/main.html', noCacheOptions);
})
.get('/picture.png', (req, res) => {

    var options = {
        windowSize: { width: 1000, height: 1000 },
        shotSize: { width: 'window', height: 'window' },
        siteType: 'html'
    };
    
    let delta = Math.random() * (Math.PI / 16); // about 0..11deg

    db.one(`UPDATE "angle_table" SET "value" = mod(CAST("value" + ${delta} AS NUMERIC), CAST(PI() AS NUMERIC)) WHERE "key" = 0 RETURNING "value"`)
        .then(function (data) {
            var webshot = require('webshot');
            webshot(generateSvg.generateHTMLString(data.value * 1.0), 'static/_private_picture.png', options, function(err) {
                wss.clients.forEach((client) => {
                    // client.send('c');
                    const contents = fs.readFileSync('static/_private_picture.png', {encoding: 'base64'});
                    client.send(encodeURI(contents));

                    // fs.readFile('static/_private_picture.png', function (err, data) {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    //     client.send(data, { binary: true });
                    // });
                });
                res.sendfile('static/_private_picture.png', noCacheOptions);
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
.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
} );


const wss = new Server({ server: app });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});
