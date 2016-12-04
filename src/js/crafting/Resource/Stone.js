import store from '../../store/store';

const Stone = {
    type: 'stone',
    label: 'Stone',
    category: 'resource',
    icon: 'src/icons/stone.svg',
    requires: {
        get energy() {
            return Math.floor(5 * Math.pow(1.002, store.state.stats.items[Stone.type] || 0));
        }
    }
};

export default Stone;
