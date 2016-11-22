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
    state.battery.energy = Math.min(state.battery.capacity, state.battery.energy + amount);
}

export const BATTERY_DISCHARGE = (state, data) => {
    const amount = data.amount || 1;
    state.battery.energy = Math.max(0, state.battery.energy - amount);
}
