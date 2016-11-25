import Vue from 'vue';
import Vuex from 'vuex';
import craftingItems from './state/craftingItems';
import inventory from './state/inventory';
import battery from './state/battery';
import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import { gameTime } from '../utils';

Vue.use(Vuex);

const savedData = localStorage.getItem('CLICKER');
var state = savedData? JSON.parse(savedData) : {
    inventory,
    battery
};

var state = {
    ...state,
    craftingItems,
    inventory // reset inventory for testing
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});

export default store;

const save = () => localStorage.setItem('CLICKER', JSON.stringify(store.state));
// save every minute
setInterval(save, 60000);
// add on unload
window.onunload = save;
