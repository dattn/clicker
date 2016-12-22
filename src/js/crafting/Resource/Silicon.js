import { stats } from '../../crafting';

const Silicon = {
    type: 'silicon',
    label: 'Silicon',
    category: 'resource',
    icon: 'icons/silicon.svg',
    requires: {
        get energy() {
            return Math.floor(25 * Math.sqrt(Math.pow(1.01, stats(Silicon.type) / 2)));
        }
    }
};

export default Silicon;
