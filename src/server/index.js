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

const updateState = data => {
    if (!data.UUID) {
        return;
    }
    if (!stateStore[data.UUID]) {
        stateStore[data.UUID] = {};
        stateStore[data.UUID].publicUUID = uuidGen.generate();
    }
    stateStore[data.UUID].state = data.state;
    io.in('states').emit('STATE_UPDATE', stateStore[data.UUID]);
};

app.listen(config('PORT'));

io.on('connection', socket => {
    sendUUID(socket);
    socket.on('STATE', data => updateState(data));
    socket.on('LEAVE_STATES', () => leaveStates(socket));
    socket.on('JOIN_STATES', () => joinStates(socket));
});
