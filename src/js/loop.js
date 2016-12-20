import EventEmitter from 'events';

const delta   = 1000;
var lastTick  = Date.now();
var isRunning = false;

const loop = new EventEmitter();

const next = () => {
    const now = Date.now();
    var nextTick = lastTick;
    while (nextTick < now) {
        nextTick += delta;
    }
    setTimeout(() => {
        if (isRunning === false) {
            return;
        }
        loop.emit('tick');
        lastTick = nextTick;
        next();
    }, Math.max(0, nextTick - now));
};

export const tick = cb => loop.on('tick', cb);
export const start = () => {
    if (isRunning) {
        return;
    }
    isRunning = true;
    lastTick = Date.now();
    next();
}
export const stop = () => isRunning = false;
