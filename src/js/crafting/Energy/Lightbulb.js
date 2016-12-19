const Lightbulb = {
    type: 'lightbulb',
    label: 'Lightbulb',
    category: 'energy',
    icon: 'icons/light-bulb.svg',
    requires: {
        energy: 100,
        resources: {
            copper: 1
        }
    },
    generate: {
        get energy() {
            return -5;
        }
    }
};

export default Lightbulb;
