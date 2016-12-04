import { store } from '../../main';

const Wind = {
    type: 'wind',
    label: 'Wind',
    category: 'research',
    icon: 'src/icons/wind.svg',
    requires: {
        energy: 90
    }
};

export default Wind;
