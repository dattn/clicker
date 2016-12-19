'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _uuidTokenGenerator = require('uuid-token-generator');

var _uuidTokenGenerator2 = _interopRequireDefault(_uuidTokenGenerator);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _http2.default.createServer();
var io = new _socket2.default(app);
var uuidGen = new _uuidTokenGenerator2.default(256, _uuidTokenGenerator2.default.BASE62);

var stateStore = {};

var sendUUID = function sendUUID(socket) {
    var UUID = uuidGen.generate();
    var name = (0, _name2.default)();
    socket.emit('UUID', { UUID: UUID, name: name });
};

var sendStates = function sendStates(socket) {
    for (var i in stateStore) {
        socket.emit('STATE_UPDATE', stateStore[i]);
    }
};

var joinStates = function joinStates(socket) {
    socket.join('states');
    sendStates(socket);
};

var leaveStates = function leaveStates(socket) {
    socket.leave('states');
};

var updateState = function updateState(data) {
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

app.listen((0, _config2.default)('PORT'));

io.on('connection', function (socket) {
    sendUUID(socket);
    socket.on('STATE', function (data) {
        return updateState(data);
    });
    socket.on('LEAVE_STATES', function () {
        return leaveStates(socket);
    });
    socket.on('JOIN_STATES', function () {
        return joinStates(socket);
    });
});