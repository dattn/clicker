const solarPanel = {
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
    }
};

export default solarPanel;
