import SocketIO     from 'socket.io-client';
import EventEmitter from 'events';
import { store }    from '../app';

const events = new EventEmitter();
const io     = new SocketIO('//' + window.location.hostname + ':7777');
var UUID     = localStorage.getItem('CLICKER-UUID');

io.on('UUID', data => {
    if (!UUID) {
        UUID = data.UUID;
        localStorage.setItem('CLICKER-UUID', UUID);
    }
    if (!store.state.name) {
        store.commit('UPDATE_NAME', {
            name: data.name
        });
    }
});

io.on('STATE_UPDATE', data => {
    events.emit('STATE_UPDATE', data);
});

export const sendState = state => {
    if (!UUID) {
        return;
    }
    io.emit('STATE', {
        UUID, state
    });
};

export const joinStates = () => {
    io.emit('JOIN_STATES');
};

export const leaveStates = () => {
    io.emit('LEAVE_STATES');
};

export const stateUpdate = cb => {
    events.on('STATE_UPDATE', cb);
    return {
        off() {
            events.removeListener('STATE_UPDATE', cb);
        }
    }
};
