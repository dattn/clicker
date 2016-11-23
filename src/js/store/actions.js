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

export const craft = ({ commit, state }, resource) => {
    if (!validateRequirements(state, resource.requires)) {
        return false;
    }

    if (resource.requires.energy) {
        commit('BATTERY_DISCHARGE', {
            amount: resource.requires.energy
        });
    }

    if (resource.requires.resources) {
        for (var type in resource.requires.resources) {
            commit('INVENTORY_REMOVE', {
                type,
                amount: resource.requires.resources[type]
            });
        }
    }

    commit('INVENTORY_ADD', {
        type: resource.type,
        amount: 1
    });
}

export const updateTime = ({ commit, state }) => {
    const time = gameTime(55);
    if (time !== state.time) {
        commit('SET_TIME', { time });
    }
}
