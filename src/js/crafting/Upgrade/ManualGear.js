import { has } from '../../crafting';

const ManualGear = {
    type: 'manual-gear',
    get label() {
        return 'Manual Gear (Level: ' + (has(ManualGear.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/power.svg',
    limit: 10,
    requires: {
        get energy() {
            return 1000 * Math.pow(2, has(ManualGear.type))
        }
    }
};

export default ManualGear;
