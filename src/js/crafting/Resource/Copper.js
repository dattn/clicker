import { stats } from '../../crafting';

const Copper = {
    type: 'copper',
    label: 'Copper',
    category: 'resource',
    icon: 'icons/copper.svg',
    requires: {
        get energy() {
            return Math.floor(20 * Math.sqrt(Math.pow(1.01, stats(Copper.type) / 2)));
        }
    }
};

export default Copper;
