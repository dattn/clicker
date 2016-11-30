const windMill = {
    type: 'wind-mill',
    label: 'Wind Mill',
    category: 'energy',
    icon: 'src/icons/wind-mill.svg',
    requires: {
        energy: 60,
        resources: {
            iron: 10,
            copper: 5
        }
    }
};

export default windMill;
