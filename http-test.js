// var express = require('express');
// var app = express();
// var server = app.listen(3000, function()  {
//     console.log(`Server started on port`);
// });

// // app.get('/', function(req, res)  {
// //     res.send("hello world");
// // });

// app.get('/', (req, res) => {
//     res.send("test");
// });


// const emitter = new EventEmitter();
const Logger = require('./log');
const logger = new Logger();

logger.on('messageLogged', (arg) => {
    console.log("Listener called", arg);
});

logger.emit('messageLogged',{id:1, url:'http://'});


const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.write('hello world');
        res.end();
    }

    if(req.url === '/api/courses'){
        res.write(JSON.stringify([1,2,3]));
        res.end();
    }
});

// server.on('connection', (socket) => {
//     console.log('New connection ...');
// });

server.listen(3000);

console.log("Listening on port 3000 ...");