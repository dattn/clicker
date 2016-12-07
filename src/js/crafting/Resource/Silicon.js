import { store } from '../../app';
import { has } from '../../crafting';

const Silicon = {
    type: 'silicon',
    label: 'Silicon',
    category: 'resource',
    icon: 'src/icons/silicon.svg',
    requires: {
        get energy() {
            return Math.floor(25 * Math.pow(1.002, has(store, Silicon.type)));
        }
    }
};

export default Silicon;
