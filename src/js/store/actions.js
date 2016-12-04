import { gameTime, windForce } from '../utils';
import { craft, item } from '../crafting';

export {
    craft
}

var timeHandle;
export const startTime = ({ commit, state }) => {
    if (timeHandle) {
        clearInterval(timeHandle);
    }
    timeHandle = setInterval(() => {
        let time = gameTime(55);
        if (time !== state.time) {
            commit('SET_TIME', { time });
        }
    }, 100);
}

var windForceHandle;
export const startWindForce = ({ commit, state }) => {
    if (windForceHandle) {
        clearInterval(windForceHandle);
    }
    windForceHandle = setInterval(() => {
        let force = windForce();
        commit('SET_WIND_FORCE', { force });
    }, 1000);
}

var batteryChargeHandle;
export const startBatteryCharge = (store) => {
    if (batteryChargeHandle) {
        clearInterval(batteryChargeHandle);
    }
    batteryChargeHandle = setInterval(() => {
        var energy;
        for (let type in store.state.items) {
            const generate = item(type).generate;
            if (!generate || !generate.energy) {
                continue;
            }
            energy = generate.energy;
            if (energy < 0) {
                store.commit('BATTERY_DISCHARGE', { amount: -energy });
                continue;
            }
            store.commit('BATTERY_CHARGE', { amount: energy });
        }
    }, 1000);
}
