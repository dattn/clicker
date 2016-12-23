import { stats, has } from '../../crafting';
import MiningUpgrade from '../Upgrade/MiningUpgrade';

const MoonDust = {
    type: 'moon-dust',
    label: 'Moon Dust',
    category: 'resource',
    icon: 'icons/moon.svg',
    requires: {
        get energy() {
            return Math.floor(100 * Math.sqrt(Math.pow(1.005, stats(MoonDust.type) / (2 * Math.pow(1.1, has(MiningUpgrade.type))))));
        },
        research: {
            'space-mining': 1
        }
    }
};

export default MoonDust;
