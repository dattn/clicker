import { stats } from '../../crafting';

const Copper = {
    type: 'copper',
    label: 'Copper',
    category: 'resource',
    icon: 'icons/copper.svg',
    requires: {
        get energy() {
            return Math.floor(20 * Math.sqrt(Math.pow(1.002, stats(Copper.type))));
        }
    }
};

export default Copper;
