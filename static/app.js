'use strict';
let page_id = '';
window.onload = function(e) {
    let date = Date.now();
    let random = Math.random();
    page_id = '' + date + '' + random;
    document.getElementById('picture').style.backgroundImage = 
        `url("./picture.png?date=${date}&random=${random}")`;
}
let socket = new WebSocket("wss://prozhektorperestroiki.herokuapp.com/");

socket.onopen = function (e) { };

socket.onmessage = function(e) {
    // document.getElementById('picture').style.backgroundImage = 
    //     `url("./picture.png?date=${Date.now()}&random=${Math.random()}")`;
    let picture = `data:image/png;base64,${e.data}`;
    // console.log(e.data);
    // console.log(btoa(e.data));
    // console.log(atob(e.data));
    // let url = webkitURL.createObjectURL(picture);
    // window.open(url);
    document.getElementById('picture').style.backgroundImage = 
        `url("${picture}}")`;
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
