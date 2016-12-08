import { stats } from '../../crafting';

const Silicon = {
    type: 'silicon',
    label: 'Silicon',
    category: 'resource',
    icon: 'src/icons/silicon.svg',
    requires: {
        get energy() {
            return Math.floor(25 * Math.pow(1.002, stats(Silicon.type)));
        }
    }
};

export default Silicon;
