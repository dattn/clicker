import { has } from '../../crafting';

const DamUpgrade = {
    type: 'dam-upgrade',
    get label() {
        return 'Hydroelectric Dam (Level: ' + (has(DamUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/dam-upgrade.svg',
    limit: 10,
    requires: {
        get energy() {
            return 2000 * Math.pow(2, has(DamUpgrade.type))
        },
        research: {
            water: 1
        }
    }
};

export default DamUpgrade;
