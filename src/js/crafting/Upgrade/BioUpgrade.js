import { has } from '../../crafting';

const BioUpgrade = {
    type: 'bio-upgrade',
    get label() {
        return 'Biogas Plant (Level: ' + (has(BioUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/bio-upgrade.svg',
    limit: 10,
    requires: {
        get energy() {
            return 5000 * Math.pow(2, has(BioUpgrade.type))
        },
        research: {
            'bio-gas': 1
        }
    }
};

export default BioUpgrade;
