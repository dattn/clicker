import { gameTime } from '../utils';

const validateRequirements = function(store, requirements) {
    if (requirements.energy && requirements.energy > store.getters.energy) {
        return false;
    }

    if (requirements.resources) {
        for (var type in requirements.resources) {
            if (requirements.resources[type] > store.state.inventory[type]) {
                return false;
            }
        }
    }

    return true;
}

export const craft = (store, item) => {
    if (!validateRequirements(store, item.requires)) {
        return false;
    }

    if (item.requires.energy) {
        store.commit('BATTERY_DISCHARGE', {
            amount: item.requires.energy
        });
    }

    if (item.requires.resources) {
        for (var type in item.requires.resources) {
            store.commit('INVENTORY_REMOVE', {
                type,
                amount: item.requires.resources[type]
            });
        }
    }

    switch(item.category) {

        case 'resource':
            store.commit('INVENTORY_ADD', {
                type: item.type,
                amount: 1
            });
            break;

        case 'energy':
            store.commit('ENERGY_ADD', {
                type: item.type,
                amount: 1
            });
            break;
    }

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

var batteryChargeHandle;
export const startBatteryCharge = (store) => {
    if (batteryChargeHandle) {
        clearInterval(batteryChargeHandle);
    }
    batteryChargeHandle = setInterval(() => {
        let amount = -Math.ceil(store.state.energy.energy / 100);

        if (!store.getters.isNight) {
            amount += store.state.energy.items['solar-panel'] || 0;
        }

        if (amount < 0) {
            store.commit('BATTERY_DISCHARGE', { amount: -amount });
        }
        if (amount > 0) {
            store.commit('BATTERY_CHARGE', { amount });
        }
    }, 1000);
}
