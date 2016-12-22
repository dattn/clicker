import { has } from '../../crafting';

const BatteryUpgrade = {
    type: 'battery-upgrade',
    get label() {
        return 'Battery (Level: ' + (has(BatteryUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/battery-upgrade.svg',
    limit: 10,
    requires: {
        get energy() {
            return 1000 * Math.pow(2, has(BatteryUpgrade.type))
        },
        research: {
            chemistry: 1
        }
    }
};

export default BatteryUpgrade;
