import store from '../../store/store';

const Silicon = {
    type: 'silicon',
    label: 'Silicon',
    category: 'resource',
    icon: 'src/icons/silicon.svg',
    requires: {
        get energy() {
            return Math.floor(25 * Math.pow(1.01, store.state.stats.items[Silicon.type] || 0));
        }
    }
};

export default Silicon;
