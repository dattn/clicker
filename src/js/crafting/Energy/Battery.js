import { store } from '../../app';
import { has } from '../../crafting';

const Battery = {
    type: 'battery',
    label: 'Battery',
    category: 'energy',
    icon: 'icons/battery.svg',
    requires: {
        energy: 40,
        resources: {
            iron: 2,
            copper: 4
        }
    },
    generate: {
        get energy() {
            return -Math.ceil(store.state.energy / 100);
        },
        get capactity() {
            return has(Battery.type) * 100;
        }
    }
};

export default Battery;
