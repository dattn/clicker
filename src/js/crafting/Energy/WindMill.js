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
            iron: 12,
            copper: 5
        },
        research: {
            wind: 1
        }
    },
    generate: {
        get energy() {
            return has(WindMill.type) * (store.state.windForce / 100) * Math.pow(1.25, has(WindUpgrade.type));
        }
    }
};

export default WindMill;
