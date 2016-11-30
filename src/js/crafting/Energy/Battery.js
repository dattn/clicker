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
    }
};

export default Battery;
