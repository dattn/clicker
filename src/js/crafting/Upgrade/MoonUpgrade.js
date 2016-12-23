import { has } from '../../crafting';

const MoonUpgrade = {
    type: 'moon-upgrade',
    get label() {
        return 'Moon Panel (Level: ' + (has(MoonUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/moon-upgrade.svg',
    limit: 10,
    requires: {
        get energy() {
            return 10000 * Math.pow(2, has(MoonUpgrade.type))
        },
        research: {
            sun: 1
        }
    }
};

export default MoonUpgrade;
