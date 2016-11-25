export const inventoryIsEmpty = (state) => {
    return Object.keys(state.inventory).length === 0;
}

export const energy = (state) => {
    return state.energy.energy;
}

export const capacity = (state) => {
    return state.energy.items.battery * 100;
}
