import store from '../../store/store';

const Copper = {
    type: 'copper',
    label: 'Copper',
    category: 'resource',
    icon: 'src/icons/copper.svg',
    requires: {
        get energy() {
            return Math.floor(20 * Math.pow(1.01, store.state.stats.items[Copper.type] || 0));
        }
    }
};

export default Copper;
