import { has } from '../../crafting';

const WindUpgrade = {
    type: 'wind-upgrade',
    get label() {
        return 'Wind Mill (Level: ' + (has(WindUpgrade.type)+1) + ')';
    },
    category: 'upgrade',
    icon: 'icons/wind-upgrade.svg',
    limit: 10,
    requires: {
        get energy() {
            return 2000 * Math.pow(2, has(WindUpgrade.type))
        },
        research: {
            wind: 1
        }
    }
};

export default WindUpgrade;
