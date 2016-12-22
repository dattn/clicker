import { item } from '../crafting';

const battery = item('battery');
export const capacity = (state) => {
    return Math.floor(battery.generate.capacity);
}

export const isNight = (state) => {
    return state.time < 60 * 8
        || state.time >= 60 * 20;
}
