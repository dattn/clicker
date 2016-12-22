import { has } from '../../crafting';

const SolarUpgrade = {
    type: 'solar-upgrade',
    get label() {
        return 'Solar Panel (Level: ' + (has(SolarUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/solar-upgrade.svg',
    limit: 10,
    requires: {
        get energy() {
            return 2000 * Math.pow(2, has(SolarUpgrade.type))
        },
        research: {
            sun: 1
        }
    }
};

export default SolarUpgrade;
