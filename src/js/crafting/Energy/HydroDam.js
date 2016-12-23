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
            stone: 250,
            iron: 40,
            copper: 25
        },
        research: {
            water: 1
        }
    },
    generate: {
        get energy() {
            return has(HydroDam.type) * 4 * Math.pow(1.25, has(DamUpgrade.type));
        }
    }
};

export default HydroDam;
