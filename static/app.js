'use strict';

window.onload = function(e) {
    if (window.scrollY <= document.querySelector('#main > p').offsetTop) {
        document.getElementById('main').style.animation = 
            'main_block_moving .7s ease-in 0s 1';
    }

    document.getElementById('picture').style.backgroundImage = 
        `url("./picture.png?date=${Date.now()}&random=${Math.random()}")`;
}

let socket = new WebSocket("wss://prozhektorperestroiki.herokuapp.com/");

socket.onopen = function (e) { };

socket.onmessage = function(e) {
    document.getElementById('picture').style.backgroundImage = 
        `url("./picture.png?date=${Date.now()}&random=${Math.random()}")`;
};  

socket.onclose = function (e) {};

socket.onerror = function(error) {
    console.error(`[error] ${error.message}`);
};

setInterval(() => {
    (async function () {
        let url = `/keep_active?date=${new Date().toString()}&random=${Math.random()}`;
        let response = await fetch(url);
        let data = await response.text();
    })();
}, 1000 * 60 * 10);
