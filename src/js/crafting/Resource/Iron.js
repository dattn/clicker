import { stats } from '../../crafting';

const Iron = {
    type: 'iron',
    label: 'Iron',
    category: 'resource',
    icon: 'src/icons/iron.svg',
    requires: {
        get energy() {
            return Math.floor(10 * Math.sqrt(Math.pow(1.002, stats(Iron.type))));
        }
    }
};

export default Iron;
