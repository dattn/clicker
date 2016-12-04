export const capacity = (state) => {
    return state.items.battery * 100;
}

export const isNight = (state) => {
    return state.time < 60 * 8
        || state.time >= 60 * 20;
}
