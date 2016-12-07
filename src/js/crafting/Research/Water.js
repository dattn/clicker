import { store } from '../../app';

const Water = {
    type: 'water',
    label: 'Water',
    category: 'research',
    icon: 'src/icons/water.svg',
    limit: 1,
    requires: {
        energy: 1000
    }
};

export default Water;
