import { stats } from '../../crafting';

const Stone = {
    type: 'stone',
    label: 'Stone',
    category: 'resource',
    icon: 'src/icons/stone.svg',
    requires: {
        get energy() {
            return Math.floor(5 * Math.sqrt(Math.pow(1.002, stats(Stone.type))));
        }
    }
};

export default Stone;
