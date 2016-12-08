import { store } from '../../app';
import { has } from '../../crafting';

const SolarPanel = {
    type: 'solar-panel',
    label: 'Solar Panel',
    category: 'energy',
    icon: 'src/icons/solar-panel.svg',
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
            if (store.getters.isNight) {
                return 0;
            }
            return has(SolarPanel.type);
        }
    }
};

export default SolarPanel;
