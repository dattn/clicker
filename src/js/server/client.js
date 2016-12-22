import SocketIO     from 'socket.io-client';
import EventEmitter from 'events';
import { store }    from '../app';

const events = new EventEmitter();
const io     = new SocketIO('//' + window.location.hostname + ':7777');
const UUID = {
    private: localStorage.getItem('CLICKER-UUID'),
    public: localStorage.getItem('CLICKER-PUBLIC-UUID')
};

io.on('UUID', data => {
    if (!UUID.private) {
        UUID.private = data.UUID;
        localStorage.setItem('CLICKER-UUID', UUID.private);
    }
    if (!store.state.name) {
        store.commit('UPDATE_NAME', {
            name: data.name
        });
    }
});

io.on('PUBLIC_UUID', data => {
    UUID.public = data.UUID;
    localStorage.setItem('CLICKER-PUBLIC-UUID', UUID.public);
});

io.on('STATE_UPDATE', data => {
    events.emit('STATE_UPDATE', data);
});

export const sendState = state => {
    if (!UUID.private) {
        return;
    }
    io.emit('STATE', {
        UUID: UUID.private,
        state
    });
};

export const joinStates = () => {
    io.emit('JOIN_STATES');
};

export const leaveStates = () => {
    io.emit('LEAVE_STATES');
};

export const stateUpdate = cb => {
    events.on('STATE_UPDATE', data => {
        if (data.publicUUID !== UUID.public) {
            cb(data);
        }
    });
    return {
        off() {
            events.removeListener('STATE_UPDATE', cb);
        }
    }
};
