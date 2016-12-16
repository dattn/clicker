import config from './config';
import http from 'http';
import SocketIO from 'socket.io';

const app = http.createServer();
const io = new SocketIO(app);

app.listen(config('PORT'));

io.on('connection', (socket) => {
    console.log('new client connected');
});
