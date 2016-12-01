import { store } from '../../main';

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
    },
    generate: {
        get energy() {
            return -Math.ceil(store.state.energy.energy / 100);
        },
        get capactity() {
            return (store.state.energy.items[Battery.type] || 0) * 100;
        }
    }
};

export default Battery;
