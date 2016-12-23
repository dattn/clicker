import { store }  from '../../app';
import { has }    from '../../crafting';
import BioMass    from '../Resource/BioMass';
import BioUpgrade from '../Upgrade/BioUpgrade';

const BioGasPlant = {
    type: 'bio-gas-plant',
    label: 'Biogas Plant',
    category: 'energy',
    icon: 'icons/biogas-plant.svg',
    requires: {
        energy: 500,
        resources: {
            stone: 80,
            iron: 5,
        },
        research: {
            'bio-gas': 1
        }
    },
    generate: {
        get energy() {
            return store.state.bioMassStock * 25 * Math.pow(1.5, has(BioUpgrade.type));
        },
        consume() {
            const bioMassStock = Math.min(has(BioGasPlant.type) * (0.2 / Math.pow(1.5, has(BioUpgrade.type))), has(BioMass.type));
            store.commit('ITEM_REMOVE', {
                type: BioMass.type,
                amount: bioMassStock
            });
            store.commit('BIO_MASS_STOCK', {
                amount: bioMassStock
            });
        }
    }
};

export default BioGasPlant;
