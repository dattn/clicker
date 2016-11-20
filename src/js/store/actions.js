export const craft = ({ commit, state }, resource) => {
    for (var i = 0; i < resource.requires.length; i++) {
        if (resource.requires[i].type === 'energy') {
            if (state.battery.energy < resource.requires[i].amount) {
                return;
            }
            commit('BATTERY_DISCHARGE', {
                amount: resource.requires[i].amount
            });
        }
    }

    commit('INVENTORY_ADD', {
        type: resource.type,
        amount: 1
    });
}
