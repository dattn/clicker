const HydroDam = {
    type: 'hydro-dam',
    label: 'Hydroelectric Dam',
    category: 'energy',
    icon: 'src/icons/hydro-dam.svg',
    requires: {
        energy: 500,
        resources: {
            iron: 50,
            copper: 10
        }
    },
    generate: {
        energy({ state }) {
            return (state.energy.items[HydroDam.type] || 0) * 5;
        }
    }
};

export default HydroDam;
