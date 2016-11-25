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

    store.commit('INVENTORY_ADD', {
        type: item.type,
        amount: 1
    });
}

export const updateTime = ({ commit, state }) => {
    const time = gameTime(55);
    if (time !== state.time) {
        commit('SET_TIME', { time });
    }
}
