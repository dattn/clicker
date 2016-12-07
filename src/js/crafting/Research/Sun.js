import { store } from '../../app';

const Sun = {
    type: 'sun',
    label: 'Sun',
    category: 'research',
    icon: 'src/icons/sun.svg',
    limit: 1,
    requires: {
        energy: 90
    }
};

export default Sun;
