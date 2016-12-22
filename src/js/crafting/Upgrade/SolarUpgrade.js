import { has } from '../../crafting';

const SolarUpgrade = {
    type: 'solar-upgrade',
    get label() {
        return 'Solar Panel (Level: ' + (has('solar-upgrade')+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/solar-upgrade.svg',
    limit: 7,
    requires: {
        get energy() {
            return 1000 * Math.pow(2, has('manual-gear'))
        }
    }
};

export default ManualGear;
