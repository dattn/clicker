import { stats, has } from '../../crafting';
import MiningUpgrade from '../Upgrade/MiningUpgrade';

const Copper = {
    type: 'copper',
    label: 'Copper',
    category: 'resource',
    icon: 'icons/copper.svg',
    requires: {
        get energy() {
            return Math.floor(20 * Math.sqrt(Math.pow(1.005, stats(Copper.type) / (2 * Math.pow(1.1, has(MiningUpgrade.type))))));
        }
    }
};

export default Copper;
