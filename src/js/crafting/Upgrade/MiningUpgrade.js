import { has } from '../../crafting';

const MiningUpgrade = {
    type: 'mining-upgrade',
    get label() {
        return 'Mining (Level: ' + (has(MiningUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/wagon.svg',
    limit: 10,
    requires: {
        get energy() {
            return 10000 * Math.pow(2, has(MiningUpgrade.type))
        },
        research: {
            water: 1,
            sun: 1,
            wind: 1,
            automation: 1
        }
    }
};

export default MiningUpgrade;
