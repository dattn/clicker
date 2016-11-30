import Vue from 'vue';
import Vuex from 'vuex';
import inventory from './state/inventory';
import energy from './state/energy';
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

var state = {
    inventory,
    energy,
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
