import { store } from '../../app';
import { has } from '../../crafting';
import { dayLight } from '../../utils';
import MoonUpgrade from '../Upgrade/MoonUpgrade';

const MoonPanel = {
    type: 'moon-panel',
    label: 'Moon Panel',
    category: 'energy',
    icon: 'icons/moon-panel.svg',
    requires: {
        energy: 2000,
        resources: {
            'moon-dust': 20,
            silicon: 20,
            copper: 5
        },
        research: {
            'space-mining': 1
        }
    },
    generate: {
        get energy() {
            return has(MoonPanel.type) * 10 * (1-dayLight(store.state.time)) * Math.pow(1.25, has(MoonUpgrade.type));
        }
    }
};

export default MoonPanel;
