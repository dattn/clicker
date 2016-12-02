import store from '../../store/store';

const Iron = {
    type: 'iron',
    label: 'Iron',
    category: 'resource',
    icon: 'src/icons/iron.svg',
    requires: {
        get energy() {
            return Math.floor(10 * Math.pow(1.01, store.state.stats.crafting[Iron.type] || 0));
        }
    }
};

export default Iron;
