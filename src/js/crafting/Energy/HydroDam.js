import { store } from '../../main';
import { has } from '../../crafting';

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
            return has(store, HydroDam.type) * 5;
        }
    }
};

export default HydroDam;
