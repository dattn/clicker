import { store } from '../../app';
import { has } from '../../crafting';
import { dayLight } from '../../utils';
import SolarUpgrade from '../Upgrade/SolarUpgrade';

const SolarPanel = {
    type: 'solar-panel',
    label: 'Solar Panel',
    category: 'energy',
    icon: 'icons/solar-panel.svg',
    requires: {
        energy: 60,
        resources: {
            iron: 5,
            copper: 5,
            silicon: 5
        },
        research: {
            sun: 1
        }
    },
    generate: {
        get energy() {
            return has(SolarPanel.type) * dayLight(store.state.time) * Math.pow(1.25, has(SolarUpgrade.type));
        }
    }
};

export default SolarPanel;
