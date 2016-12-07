import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import { gameTime } from '../utils';

Vue.use(Vuex);

const baseItems = {
    items: {
        battery: 1
    },
    energy: 0
};

const savedData = localStorage.getItem('CLICKER');
var state = savedData? JSON.parse(savedData) : {
    ...baseItems,
    stats: baseItems,
    time: gameTime(55),
    windForce: 0
};

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: true
});

export default store;

const save = () => localStorage.setItem('CLICKER', JSON.stringify(store.state));
// save every minute
setInterval(save, 60000);
// add on unload
window.onunload = save;
