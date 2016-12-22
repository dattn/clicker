import { store } from '../../app';
import { has }   from '../../crafting';
import BioMass   from '../Resource/BioMass';

const BioGasPlant = {
    type: 'bio-gas-plant',
    label: 'Biogas Plant',
    category: 'energy',
    icon: 'icons/biogas-plant.svg',
    requires: {
        energy: 500,
        resources: {
            stone: 20,
            iron: 20,
        },
        research: {
            'bio-gas': 1
        }
    },
    generate: {
        get energy() {
            return store.state.bioMassStock * 5;
        },
        consume() {
            const bioMassStock = Math.min(has(BioGasPlant.type), has(BioMass.type));
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
