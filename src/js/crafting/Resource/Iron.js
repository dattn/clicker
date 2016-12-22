import { stats } from '../../crafting';

const Iron = {
    type: 'iron',
    label: 'Iron',
    category: 'resource',
    icon: 'icons/iron.svg',
    requires: {
        get energy() {
            return Math.floor(10 * Math.sqrt(Math.pow(1.01, stats(Iron.type) / 2)));
        }
    }
};

export default Iron;
