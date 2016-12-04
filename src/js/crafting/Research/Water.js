import { store } from '../../main';

const Water = {
    type: 'water',
    label: 'Water',
    category: 'research',
    icon: 'src/icons/water.svg',
    requires: {
        energy: 1000
    }
};

export default Water;
