import { store } from '../../app';
import { has } from '../../crafting';
import BatteryUpgrade from '../Upgrade/BatteryUpgrade';

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
            return -Math.ceil(store.state.energy / (100 * Math.pow(1.25, has(BatteryUpgrade.type))));
        },
        get capacity() {
            return has(Battery.type) * 100 * Math.pow(1.25, has(BatteryUpgrade.type));
        }
    }
};

export default Battery;
