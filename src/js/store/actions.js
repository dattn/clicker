import { gameTime } from '../utils';

const validateRequirements = function(state, requirements) {
    if (requirements.energy && requirements.energy > state.battery.energy) {
        return false;
    }

    if (requirements.resources) {
        for (var type in requirements.resources) {
            if (requirements.resources[type] > state.inventory[type]) {
                return false;
            }
        }
    }

    return true;
}

export const craft = ({ commit, state }, item) => {
    if (!validateRequirements(state, item.requires)) {
        return false;
    }

    if (item.requires.energy) {
        commit('BATTERY_DISCHARGE', {
            amount: item.requires.energy
        });
    }

    if (item.requires.resources) {
        for (var type in item.requires.resources) {
            commit('INVENTORY_REMOVE', {
                type,
                amount: item.requires.resources[type]
            });
        }
    }

    commit('INVENTORY_ADD', {
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
