const http = require('http');
const server = http.createServer();

server.listen(4000, () => {
    console.log('Port 4000 is free!');
    server.close();
});

server.on('error', (err) => {
    console.log('Port 4000 is BUSY: ' + err.message);
});
