import { has }    from '../../crafting';
import DamUpgrade from '../Upgrade/DamUpgrade';

const HydroDam = {
    type: 'hydro-dam',
    label: 'Hydroelectric Dam',
    category: 'energy',
    icon: 'icons/hydro-dam.svg',
    requires: {
        energy: 500,
        resources: {
            stone: 100,
            iron: 50,
            copper: 10
        },
        research: {
            water: 1
        }
    },
    generate: {
        get energy() {
            return has(HydroDam.type) * 5 * Math.pow(1.25, has(DamUpgrade.type));
        }
    }
};

export default HydroDam;
