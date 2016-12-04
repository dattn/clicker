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
