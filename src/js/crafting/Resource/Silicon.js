import { stats, has } from '../../crafting';
import MiningUpgrade from '../Upgrade/MiningUpgrade';

const Silicon = {
    type: 'silicon',
    label: 'Silicon',
    category: 'resource',
    icon: 'icons/silicon.svg',
    requires: {
        get energy() {
            return Math.floor(25 * Math.sqrt(Math.pow(1.005, stats(Silicon.type) / (2 * Math.pow(1.1, has(MiningUpgrade.type))))));
        }
    }
};

export default Silicon;
