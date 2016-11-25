export const inventoryIsEmpty = (state) => {
    return Object.keys(state.inventory).length === 0;
}

export const energy = (state) => {
    return state.energy.energy;
}

export const capacity = (state) => {
    return state.energy.items.battery * 100;
}

export const isNight = (state) => {
    return state.time < 60 * 8
        || state.time >= 60 * 20;
}
