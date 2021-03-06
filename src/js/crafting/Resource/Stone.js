import { stats, has } from '../../crafting';
import MiningUpgrade from '../Upgrade/MiningUpgrade';

const Stone = {
    type: 'stone',
    label: 'Stone',
    category: 'resource',
    icon: 'icons/stone.svg',
    requires: {
        get energy() {
            return Math.floor(5 * Math.sqrt(Math.pow(1.005, stats(Stone.type) / (2 * Math.pow(1.1, has(MiningUpgrade.type))))));
        }
    }
};

export default Stone;
