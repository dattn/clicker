import { has } from '../../crafting';

const ManualGear = {
    type: 'manual-gear',
    get label() {
        return 'Manual Gear (Level: ' + (has('manual-gear')+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/power.svg',
    limit: 7,
    requires: {
        get energy() {
            return 1000 * Math.pow(2, has('manual-gear'))
        }
    }
};

export default ManualGear;
