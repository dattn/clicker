import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as getters from './getters';
import { gameTime } from '../utils';
import deepMerge from 'deepmerge';
import sha1 from 'simple-sha1';

Vue.use(Vuex);

const deepClone = obj => JSON.parse(JSON.stringify(obj));

const load = () => {
    const encodedData = localStorage.getItem('CLICKER');
    if (!encodedData) {
        return {};
    }
    var rawData;
    try {
        rawData = atob(encodedData);
    } catch(e) {
        return {};
    }

    const index   = rawData.lastIndexOf(':');
    const rawJSON = rawData.substring(0, index);
    const hash    = rawData.substring(index + 1);
    if (sha1.sync(rawJSON) !== hash) {
        return {};
    }

    try {
        return JSON.parse(rawJSON);
    } catch(e) {}
    return {};
}

const save = () => {
    const rawJSON = JSON.stringify(store.state);
    const hash    = sha1.sync(rawJSON);
    const encodedData = btoa(rawJSON + ':' + hash);
    return localStorage.setItem('CLICKER', encodedData);
}

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
    windForce: 0,
    robotsOn: true
};
const savedState = load();
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

// save every minute
setInterval(save, 60000);
// add on unload
window.onunload = save;
