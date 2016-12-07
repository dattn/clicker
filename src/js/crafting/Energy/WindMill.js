import { store } from '../../main';
import { has } from '../../crafting';

const WindMill = {
    type: 'wind-mill',
    label: 'Wind Mill',
    category: 'energy',
    icon: 'src/icons/wind-mill.svg',
    requires: {
        energy: 60,
        resources: {
            stone: 5,
            iron: 5,
            copper: 5
        },
        research: {
            wind: 1
        }
    },
    generate: {
        get energy() {
            return has(store, WindMill.type) * (store.state.windForce / 100);
        }
    }
};

export default WindMill;
