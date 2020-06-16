'use strict';
window.onload = function(e) {
    document.getElementById('picture').style.backgroundImage = 
        `url("./picture.png?date=${new Date().toString()}&random=${Math.random()}")`;
}
let socket = new WebSocket("wss://prozhektorperestroiki.herokuapp.com/");

socket.onopen = function (e) { };

socket.onmessage = function(E) {
    document.getElementById('picture').style.backgroundImage = 
        `url("./picture.png?date=${new Date().toString()}&random=${Math.random()}")`;
};  

socket.onclose = function (e) {};

socket.onerror = function(error) {
    console.error(`[error] ${error.message}`);
};
