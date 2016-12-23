import { stats, has } from '../../crafting';
import MiningUpgrade from '../Upgrade/MiningUpgrade';

const Iron = {
    type: 'iron',
    label: 'Iron',
    category: 'resource',
    icon: 'icons/iron.svg',
    requires: {
        get energy() {
            return Math.floor(10 * Math.sqrt(Math.pow(1.005, stats(Iron.type) / (2 * Math.pow(1.1, has(MiningUpgrade.type))))));
        }
    }
};

export default Iron;
