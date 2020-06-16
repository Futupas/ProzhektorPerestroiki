'use strict';

const express = require('express');
const PORT = process.env.PORT || 5000;

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
    <svg id="mainsvg" style="width: 1200px;height: 1200px;/* top: -100px; *//* left: -100px; */"><line x1="1100" y1="500" x2="1031.273615391926" y2="221.1660967737389" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="1031.273615391926" y1="221.1660967737389" x2="840.8388480386935" y2="6.209680463806194" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="840.8388480386935" y1="6.209680463806194" x2="572.3220081531939" y2="-95.62532445883244" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="572.3220081531939" y1="-95.62532445883244" x2="287.23706777447876" y2="-61.009745611248945" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="287.23706777447876" y1="-61.009745611248945" x2="50.89355109733947" y2="102.1264050555227" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="50.89355109733947" y1="102.1264050555227" x2="-82.5650904556311" y2="356.41060142746517" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="-82.5650904556311" y1="356.41060142746517" x2="-82.56509045563132" y2="643.5893985725345" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="-82.56509045563132" y1="643.5893985725345" x2="50.89355109733924" y2="897.873594944477" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="50.89355109733924" y1="897.873594944477" x2="287.2370677744784" y2="1061.009745611249" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="287.2370677744784" y1="1061.009745611249" x2="572.3220081531933" y2="1095.6253244588324" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="572.3220081531933" y1="1095.6253244588324" x2="840.8388480386934" y2="993.7903195361939" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="840.8388480386934" y1="993.7903195361939" x2="1031.273615391926" y2="778.8339032262616" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><line x1="1031.273615391926" y1="778.8339032262616" x2="1100" y2="500" style="stroke: rgb(0, 0, 0); stroke-width: 1px; stroke-linecap: round;"></line><path d="M500 500 L-45.718107380920515 286.2045408018255 L901.7359901919492 925.0516557789629 L137.02161272871672 42.676496564369245 L352.24830142966084 442.11545884969775 " style="stroke: rgb(255, 0, 0); stroke-width: 1px; fill: rgb(255, 0, 0);"></path><path d="M352.24830142966084 442.11545884969775 L681.968098070124 1054.0420475544863 L416.30786288559057 -76.68177752971417 L423.4018907413458 574.1693228434297 " style="stroke: rgb(0, 255, 0); stroke-width: 1px; fill: rgb(0, 255, 0);"></path><path d="M423.4018907413458 574.1693228434297 L428.895743611691 1078.2102229720426 L717.6087164240578 -40.52534392030702 L189.26324222803117 993.383296659069 L425.1321874683924 732.9177167980235 " style="stroke: rgb(0, 0, 255); stroke-width: 1px; fill: rgb(0, 0, 255);"></path><path d="M425.1321874683924 732.9177167980235 L960.6979571895301 141.50264678111205 L7.388735561605813 814.9820944160323 L521.6518311820413 626.3329141982654 " style="stroke: rgb(255, 255, 0); stroke-width: 1px; fill: rgb(255, 255, 0);"></path><path d="M521.6518311820413 626.3329141982654 L1080.6001411785855 421.2916787626573 L-82.5650904556312 575.4075288869037 L1044.6031423915251 724.7538863207674 L648.9782852390636 579.6252437812129 " style="stroke: rgb(0, 255, 255); stroke-width: 1px; fill: rgb(0, 255, 255);"></path><path d="M648.9782852390636 579.6252437812129 L-62.698516479003615 318.5580072490252 L860.9534394396005 971.0856393815584 L435.5659535902471 501.3383479164818 " style="stroke: rgb(255, 0, 255); stroke-width: 1px; fill: rgb(255, 0, 255);"></path><path d="M435.5659535902471 501.3383479164818 L65.14488294636391 92.28942093845649 L576.9669466760195 1093.8637316382888 L419.4649435424734 483.55830945415573 " style="stroke: rgb(255, 255, 255); stroke-width: 1px; fill: rgb(255, 255, 255);"></path><path d="M419.4649435424734 483.55830945415573 L280.1841882036716 -56.141494345149795 L1095.1655396886608 519.6141765100901 L-66.82757712444618 673.5747249908677 L349.7774293721581 213.52575805469678 " style="stroke: rgb(255, 0, 0); stroke-width: 1px; fill: rgb(255, 0, 0);"></path><path d="M349.7774293721581 213.52575805469678 L615.057448312022 -79.41790982963767 L627.6363181402035 1074.647373756666 L-49.472184988395384 293.35733807614633 L619.9258813827329 367.2430119475539 " style="stroke: rgb(0, 255, 0); stroke-width: 1px; fill: rgb(0, 255, 0);"></path><path d="M619.9258813827329 367.2430119475539 L1079.789062432897 418.00100293598734 L207.6427553030806 1006.0697585360374 L463.374754285788 -82.39673282763283 L697.5255075573641 375.8081706477632 " style="stroke: rgb(0, 0, 255); stroke-width: 1px; fill: rgb(0, 0, 255);"></path><path d="M697.5255075573641 375.8081706477632 L950.2276409648086 870.3158970939314 L-82.5650904556312 491.45242472620157 L938.7973499880243 116.78197153637046 L751.9779602207666 482.36508096312133 " style="stroke: rgb(255, 255, 0); stroke-width: 1px; fill: rgb(255, 255, 0);"></path><path d="M751.9779602207666 482.36508096312133 L446.40424663314843 1080.3361401321608 L193.45692566890966 3.722012666617104 L1075.6979251235034 598.5973936058658 L669.6800868189578 643.4121355270228 " style="stroke: rgb(0, 255, 255); stroke-width: 1px; fill: rgb(0, 255, 255);"></path><path d="M669.6800868189578 643.4121355270228 L-41.461719633152484 721.9053284827271 L643.6205615733585 -68.58534982776064 L635.819325023382 647.1495607284851 " style="stroke: rgb(255, 0, 255); stroke-width: 1px; fill: rgb(255, 0, 255);"></path><path d="M635.819325023382 647.1495607284851 L631.1743877486379 1073.3055609446828 L-58.88306453540076 311.2882709473131 L1091.0404390845488 463.64963244472347 L634.302431667069 786.3189762113946 " style="stroke: rgb(255, 255, 255); stroke-width: 1px; fill: rgb(255, 255, 255);"></path><path d="M634.302431667069 786.3189762113946 L266.1151551179746 1046.4303419789971 L560.4751372332889 -94.18685389675943 L1030.5230958267518 778.1746080490385 L574.5982184660926 828.4979036945535 " style="stroke: rgb(255, 0, 0); stroke-width: 1px; fill: rgb(255, 0, 0);"></path><path d="M574.5982184660926 828.4979036945535 L45.15310568775931 886.9360900305469 L816.4535233866629 -3.0384533107406355 L805.44215274139 1007.2145153571453 L363.68659617135813 519.3922754196318 " style="stroke: rgb(0, 255, 0); stroke-width: 1px; fill: rgb(0, 255, 0);"></path><path d="M363.68659617135813 519.3922754196318 L27.018632762299717 147.61626132580182 L1046.4369294991234 282.6860804374651 L113.99080414580584 941.4264840809944 L254.1278489305 398.4086393591069 " style="stroke: rgb(0, 0, 255); stroke-width: 1px; fill: rgb(0, 0, 255);"></path><path d="M254.1278489305 398.4086393591069 L375.4546542942215 -71.72129992155737 L908.4530021761489 917.4697165957871 L-82.5650904556312 529.2195095341754 L254.44222061416917 397.19047870522763 " style="stroke: rgb(255, 255, 0); stroke-width: 1px; fill: rgb(255, 255, 0);"></path><path d="M254.44222061416917 397.19047870522763 L946.8861800711366 125.91237325330388 " style="stroke: rgb(0, 255, 255); stroke-width: 1px; fill: rgb(0, 255, 255);"></path></svg>


</body>
</html>
`;


const app = express()
.use(express.static('static'))
.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki');
})
.get('/a', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki a ');
})
.get('/b', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki b');
})
.get('/screen', (req, res) => {
    // res.writeHead(200, {'Content-Type': 'text/plain'});

    var options = {
        windowSize: { width: 1000, height: 1000 },
        shotSize: { width: 'window', height: 'window' },
        siteType: 'html'
    };


    var webshot = require('webshot');

    webshot(htmlFile, 'static/file.png', options, function(err) {
        res.sendfile('static/file.png');
    });



    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end('Prozhektor perestroiki ');
})
.get('/bfff', (req, res) => {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
    let document = dom.window.document;

    let svg = document.createElement('svg');
    svg.style.width = '500px';
    svg.style.height = '500px';
    svg.innerHTML = '<line x1="5" y1="5" x2="100" y2="200" style="stroke: red; stroke-width: 3px;" />';


    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki '+document.body.outerHTML);
})
.get('/bdddd', (req, res) => {
    // const svg = fs.readFile(input, 'utf8');
    // const canvas = preset.createCanvas(800, 600);
    // const ctx = canvas.getContext('2d');
    // const v = Canvg.fromString(ctx, svg, preset);

    // // Render only first frame, ignoring animations.
    // v.render();

    // const png = canvas.toBuffer();

    // fs.writeFile(output, png);


    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Prozhektor perestroiki b');

})
.get('/db_test', (req, res) => {

    var pgp = require('pg-promise')();
    var db = pgp(process.env.DATABASE_URL);

    db.one('SELECT 123 AS value')
        .then(function (data) {
            console.log('DATA:', data.value);
        })
        .catch(function (error) {
            console.log('ERROR:', error);
        });

    res.writeHead(200, {'Content-Type': 'text/plain'});

    res.end('Prozhektor perestroiki ' + process.env.var1);

})
.get('/picture', (req, res) => {

    // var pgp = require('pg-promise')();
    // var db = pgp(process.env.DATABASE_URL);

    // db.one('SELECT 123 AS value')
    //     .then(function (data) {
    //         console.log('DATA:', data.value);
    //     })
    //     .catch(function (error) {
    //         console.log('ERROR:', error);
    //     });

    // res.writeHead(200, {'Content-Type': 'text/plain'});

    // res.end('Prozhektor perestroiki ' + process.env.var1);

    var options = {
        windowSize: { width: 800, height: 800 },
        shotSize: { width: 'window', height: 'window' },
        siteType: 'html'
    };


    var webshot = require('webshot');

    webshot(htmlFile, 'static/file.png', options, function(err) {
        wss.clients.forEach((client) => {
            client.send('c');
        });
        res.sendfile('static/file.png');
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



// setInterval(() => {
//     wss.clients.forEach((client) => {
//         client.send(new Date().toTimeString());
//     });
// }, 1000);
