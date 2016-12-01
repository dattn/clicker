const SolarPanel = {
    type: 'solar-panel',
    label: 'Solar Panel',
    category: 'energy',
    icon: 'src/icons/solar-panel.svg',
    requires: {
        energy: 60,
        resources: {
            iron: 5,
            copper: 5,
            silicon: 5
        }
    },
    generate: {
        energy({ state, getters }) {
            if (getters.isNight) {
                return 0;
            }
            return state.energy.items[SolarPanel.type] || 0;
        }
    }
};

export default SolarPanel;
