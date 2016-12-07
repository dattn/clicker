import { store } from '../../app';
import { has } from '../../crafting';

const Stone = {
    type: 'stone',
    label: 'Stone',
    category: 'resource',
    icon: 'src/icons/stone.svg',
    requires: {
        get energy() {
            return Math.floor(5 * Math.pow(1.002, has(store, Stone.type)));
        }
    }
};

export default Stone;
