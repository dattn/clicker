import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as getters from './getters';
import { gameTime } from '../utils';
import deepMerge from 'deepmerge';

Vue.use(Vuex);

const deepClone = obj => JSON.parse(JSON.stringify(obj));

const baseItems = {
    items: {
        battery: 1
    },
    energy: 0
};

const defaultState = {
    ...deepClone(baseItems),
    robots: {},
    robotClicks: {},
    stats: deepClone(baseItems),
    time: gameTime(33.3),
    windForce: 0
};
const savedState = JSON.parse(localStorage.getItem('CLICKER') || '{}');
const state = deepMerge(defaultState, savedState, {
    arrayMerge: d => d
});


const store = new Vuex.Store({
    state,
    mutations,
    getters,
    strict: true
});

export default store;

const save = () => localStorage.setItem('CLICKER', JSON.stringify(store.state));
// save every minute
setInterval(save, 60000);
// add on unload
window.onunload = save;
