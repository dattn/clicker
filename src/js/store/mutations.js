import store from './store';

export const INVENTORY_ADD = (state, data) => {
    const amount = data.amount || 1;
    if (state.inventory[data.type]) {
        state.inventory[data.type] += amount;
    } else {
        state.inventory = {
            ...state.inventory,
            [data.type]: amount
        };
    }
}

export const INVENTORY_REMOVE = (state, data) => {
    const amount = data.amount || 1;
    if (state.inventory[data.type]) {
        state.inventory[data.type] = Math.max(0, state.inventory[data.type] -= amount);
    }
}

export const BATTERY_CHARGE = (state, data) => {
    const amount = data.amount || 1;
    state.energy.energy = Math.min(store.getters.capacity, state.energy.energy + amount);
    state.stats.energy += amount;
}

export const BATTERY_DISCHARGE = (state, data) => {
    const amount = data.amount || 1;
    state.energy.energy = Math.max(0, state.energy.energy - amount);
}

export const SET_TIME = (state, data) => {
    state.time = data.time;
}

export const SET_WIND_FORCE = (state, data) => {
    state.windForce = data.force;
}

export const ENERGY_ADD = (state, data) => {
    const amount = data.amount || 1;
    if (state.energy.items[data.type]) {
        state.energy.items[data.type] += amount;
    } else {
        state.energy.items = {
            ...state.energy.items,
            [data.type]: amount
        };
    }

    // stats
    if (state.stats.crafting[data.type]) {
        state.stats.crafting[data.type] += amount;
    } else {
        state.stats.crafting = {
            ...state.stats.crafting,
            [data.type]: amount
        };
    }
}
