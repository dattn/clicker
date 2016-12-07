import { store } from '../../app';
import { has } from '../../crafting';

const Iron = {
    type: 'iron',
    label: 'Iron',
    category: 'resource',
    icon: 'src/icons/iron.svg',
    requires: {
        get energy() {
            return Math.floor(10 * Math.pow(1.002, has(store, Iron.type)));
        }
    }
};

export default Iron;
