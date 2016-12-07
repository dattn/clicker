import { store } from '../../app';
import { has } from '../../crafting';

const Copper = {
    type: 'copper',
    label: 'Copper',
    category: 'resource',
    icon: 'src/icons/copper.svg',
    requires: {
        get energy() {
            return Math.floor(20 * Math.pow(1.002, has(store, Copper.type)));
        }
    }
};

export default Copper;
