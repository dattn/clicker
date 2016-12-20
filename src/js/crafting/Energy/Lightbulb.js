import { store } from '../../app';
import { has } from '../../crafting';

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
            if (!store.state.lightsOn) {
                return 0;
            }
            return -has(Lightbulb.type) * 5;
        }
    }
};

export default Lightbulb;
