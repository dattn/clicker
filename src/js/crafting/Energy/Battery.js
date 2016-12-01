const Battery = {
    type: 'battery',
    label: 'Battery',
    category: 'energy',
    icon: 'src/icons/battery.svg',
    requires: {
        energy: 40,
        resources: {
            iron: 2,
            copper: 4
        }
    },
    generate: {
        energy({ state }) {
            return -Math.ceil(state.energy.energy / 100);
        },
        capactity({ state }) {
            return (state.energy.items[Battery.type] || 0) * 100;
        }
    }
};

export default Battery;
