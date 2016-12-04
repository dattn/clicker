import { store } from '../../main';

const WindMill = {
    type: 'wind-mill',
    label: 'Wind Mill',
    category: 'energy',
    icon: 'src/icons/wind-mill.svg',
    requires: {
        energy: 60,
        resources: {
            iron: 10,
            copper: 5
        },
        research: {
            wind: 1
        }
    },
    generate: {
        get energy() {
            return (store.state.items[WindMill.type] || 0) * (store.state.windForce / 100);
        }
    }
};

export default WindMill;
