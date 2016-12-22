import config         from './config';
import http           from 'http';
import SocketIO       from 'socket.io';
import TokenGenerator from 'uuid-token-generator';
import randomName     from './name';

const app     = http.createServer();
const io      = new SocketIO(app);
const uuidGen = new TokenGenerator(256, TokenGenerator.BASE62);

const stateStore = {};

const sendUUID = socket => {
    const UUID = uuidGen.generate();
    const name = randomName();
    socket.emit('UUID', { UUID, name });
};

const sendStates = socket => {
    for (let i in stateStore) {
        if (i === socket.UUID) {
            continue;
        }
        socket.emit('STATE_UPDATE', stateStore[i]);
    }
};

const joinStates = socket => {
    socket.join('states');
    sendStates(socket);
};

const leaveStates = socket => {
    socket.leave('states');
};

const updateState = (socket, data) => {
    if (!checkUUID(socket, data)) {
        return;
    }
    if (!stateStore[data.UUID]) {
        stateStore[data.UUID] = {};
        stateStore[data.UUID].publicUUID = uuidGen.generate();
    }
    stateStore[data.UUID].state = data.state;
    socket.broadcast.in('states').emit('STATE_UPDATE', stateStore[data.UUID]);
};

const checkUUID = (socket, data) => {
    if (!data.UUID) {
        return false;
    }
    if (socket.UUID && socket.UUID !== data.UUID) {
        return false;
    }
    const socketByUUID = getSocketByUUID(data.UUID);
    if (socketByUUID && socketByUUID !== socket) {
        return false;
    }
    if (!socket.UUID) {
        socket.UUID = data.UUID;
    }
    return true;
};

const getSocketByUUID = UUID => {
    if (!UUID) {
        return null;
    }
    for (let id in io.sockets.sockets) {
        if (io.sockets.sockets[id].UUID === UUID) {
            return io.sockets.sockets[id];
        }
    }
    return null;
};

app.listen(config('PORT'));

io.on('connection', socket => {
    sendUUID(socket);
    socket.on('STATE', data => updateState(socket, data));
    socket.on('LEAVE_STATES', () => leaveStates(socket));
    socket.on('JOIN_STATES', () => joinStates(socket));
});
