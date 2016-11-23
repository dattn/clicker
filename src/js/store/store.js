import Vue from 'vue';
import Vuex from 'vuex';
import resources from './state/resources';
import inventory from './state/inventory';
import battery from './state/battery';
import * as mutations from './mutations';
import * as actions from './actions';
import { gameTime } from '../utils';

Vue.use(Vuex);

const savedData = localStorage.getItem('CLICKER');
var state = savedData? JSON.parse(savedData) : {
    inventory,
    battery
};

var state = {
    ...state,
    resources,
    time: gameTime(55)
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
});

export default store;

const save = () => localStorage.setItem('CLICKER', JSON.stringify(store.state));
// save every minute
setInterval(save, 60000);
// add on unload
window.onunload = save;
