import store from '../../store/store';

const Iron = {
    type: 'iron',
    label: 'Iron',
    category: 'resource',
    icon: 'src/icons/iron.svg',
    requires: {
        get energy() {
            return Math.floor(10 * Math.pow(1.002, store.state.stats.items[Iron.type] || 0));
        }
    }
};

export default Iron;