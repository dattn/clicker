import { stats } from '../../crafting';

const Stone = {
    type: 'stone',
    label: 'Stone',
    category: 'resource',
    icon: 'icons/stone.svg',
    requires: {
        get energy() {
            return Math.floor(5 * Math.sqrt(Math.pow(1.01, stats(Stone.type) / 2)));
        }
    }
};

export default Stone;
