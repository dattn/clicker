import { store } from '../../main';

const HydroDam = {
    type: 'hydro-dam',
    label: 'Hydroelectric Dam',
    category: 'energy',
    icon: 'src/icons/hydro-dam.svg',
    requires: {
        energy: 500,
        resources: {
            stone: 100,
            iron: 50,
            copper: 10
        },
        research: {
            water: 1
        }
    },
    generate: {
        get energy() {
            return (store.state.items[HydroDam.type] || 0) * 5;
        }
    }
};

export default HydroDam;
