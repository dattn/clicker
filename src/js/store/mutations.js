import store from './store';

const addItem = (state, type, amount) => {
    if (state.items[type]) {
        state.items[type] += amount;
    } else {
        state.items = {
            ...state.items,
            [type]: amount
        };
    }
};

export const ITEM_ADD = (state, data) => {
    const amount = data.amount || 1;
    addItem(state, data.type, amount);
    addItem(state.stats, data.type, amount);
    if (state.items[data.type] > state.stats.items[data.type]) {
        state.items[data.type] = 0;
    }
}

export const ITEM_REMOVE = (state, data) => {
    const amount = data.amount || 1;
    if (!state.items[data.type]) {
        return;
    }
    state.items[data.type] = Math.max(0, state.items[data.type] -= amount);
}

export const BATTERY_CHARGE = (state, data) => {
    const amount = data.amount || 1;
    state.energy = Math.min(store.getters.capacity, state.energy + amount);
    state.stats.energy += amount;
}

export const BATTERY_DISCHARGE = (state, data) => {
    const amount = data.amount || 1;
    state.energy = Math.max(0, state.energy - amount);
}

export const SET_TIME = (state, data) => {
    state.time = data.time;
}

export const SET_WIND_FORCE = (state, data) => {
    state.windForce = data.force;
}

export const ADD_ROBOT = (state, data) => {
    if (state.robots[data.type]) {
        state.robots[data.type] += 1;
    } else {
        state.robots = {
            ...state.robots,
            [data.type]: 1
        };
    }
}

export const REMOVE_ROBOT = (state, data) => {
    if (!state.robots[data.type]) {
        return;
    }
    state.robots[data.type] = Math.max(0, state.robots[data.type] - 1);
}

export const ROBOT_ADD_CLICK = (state, data) => {
    if (state.robotClicks[data.type]) {
        state.robotClicks[data.type] += data.amount;
    } else {
        state.robotClicks = {
            ...state.robotClicks,
            [data.type]: data.amount
        };
    }
}

export const ROBOT_REMOVE_CLICK = (state, data) => {
    if (!state.robotClicks[data.type]) {
        return;
    }
    state.robotClicks[data.type] = Math.max(0, state.robotClicks[data.type] - 1);
}

export const TURN_ROBOTS_ON = (state) => {
    state.robotsOn = true;
}

export const TURN_ROBOTS_OFF = (state) => {
    state.robotsOn = false;
}

export const TURN_LIGHTS_ON = (state) => {
    state.lightsOn = true;
}

export const TURN_LIGHTS_OFF = (state) => {
    state.lightsOn = false;
}

export const INCREMENT_CLICK_STATS = (state) => {
    if (state.stats.clicks) {
        state.stats.clicks++;
    } else {
        state.stats = {
            ...state.stats,
            clicks: 1
        };
    }
}

export const UPDATE_NAME = (state, data) => {
    state.name = data.name;
}
