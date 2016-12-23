import { store }   from '../../app';
import { has }     from '../../crafting';
import WindUpgrade from '../Upgrade/WindUpgrade';

const WindMill = {
    type: 'wind-mill',
    label: 'Wind Mill',
    category: 'energy',
    icon: 'icons/wind-mill.svg',
    requires: {
        energy: 60,
        resources: {
            iron: 15,
            stone: 15
        },
        research: {
            wind: 1
        }
    },
    generate: {
        get energy() {
            return has(WindMill.type) * 1 * (store.state.windForce / 100) * Math.pow(1.25, has(WindUpgrade.type));
        }
    }
};

export default WindMill;
