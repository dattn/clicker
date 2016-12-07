import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import { gameTime } from '../utils';

Vue.use(Vuex);

/*const savedData = localStorage.getItem('CLICKER');
var state = savedData? JSON.parse(savedData) : {
    inventory,
    energy
};*/

const baseItems = {
    items: {
        battery: 1,
        stone: 10000,
        iron: 10000,
        copper: 10000,
        silicon: 10000
    },
    energy: 0
};

var state = {
    ...baseItems,
    stats: baseItems,
    time: gameTime(55),
    windForce: 0,
}

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
