// include polyfills
// TODO: use polyfills from https://github.com/zloirock/core-js
import classListPolyfill    from 'classlist-polyfill';
import PromisePolyFill      from 'promise-polyfill';
import ObjectValuesPolyFill from 'object.values';
if (!window.Promise) {
    window.Promise = PromisePolyFill;
}
if (!Object.values) {
    ObjectValuesPolyFill.shim();
}

// include app
import Vue from 'vue';
import Vuex from 'vuex';
import store from './store/store';
import AppVue from '../vue/app.vue';
import PageClickerVue from '../vue/page/clicker.vue';
import PageScoreVue from '../vue/page/score.vue';
import { gameTime, windForce, shuffle } from './utils';
import { item, craft } from './crafting';
import { tick, start } from './loop';
import ServerClient from './server/client';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export {
    store
}

const routes = [
    {
        name: 'clicker',
        path: '/',
        component: PageClickerVue
    },
    {
        name: 'score',
        path: '/score',
        component: PageScoreVue
    }
];
const router = new VueRouter({ routes });

new Vue({
    el: '#App',
    router,
    store,
    render: h => h(AppVue)
});

// update wind force
tick(() => {
    let force = windForce();
    store.commit('SET_WIND_FORCE', { force });
});

// generate energy
tick(() => {
    var energy = 0;
    for (let type in store.state.items) {
        const generate = item(type).generate;
        if (!generate || !generate.energy) {
            continue;
        }
        energy += generate.energy;
    }

    // get energy lost by lightbulbs
    const lightbulbEnergy = -item('lightbulb').generate.energy;
    if (lightbulbEnergy > 0) {
        const deltaEnergy = store.state.energy + energy;
        var growEnergy = 0;
        if (deltaEnergy > 0) {
            growEnergy = lightbulbEnergy;
        } else if (deltaEnergy + lightbulbEnergy >= 0) {
            growEnergy = lightbulbEnergy + deltaEnergy;
        }
        if (growEnergy) {
            store.commit('GROW_TREE', { growEnergy });
        }
        store.commit('LIGHTS_POWER', {
            power: growEnergy / lightbulbEnergy
        });
    }

    if (energy < 0) {
        store.commit('BATTERY_DISCHARGE', { amount: -energy });
    } if (energy > 0) {
        store.commit('BATTERY_CHARGE', { amount: energy });
    }
});

// set game time
tick(() => {
    let time = gameTime(33.3);
    if (time !== store.state.time) {
        store.commit('SET_TIME', { time });
    }
});

// handle robots
tick(() => {
    if (!store.state.robotsOn) {
        return;
    }

    const types = shuffle(Object.keys(store.state.robots));
    const robot = item('robot');

    // generate clicks
    for (var i = 0; i < types.length; i++) {
        for (var j = 0; j < store.state.robots[types[i]]; j++) {
            store.commit('ROBOT_ADD_CLICK', {
                type: types[i],
                amount: robot.click
            });
            if (store.state.robotClicks[types[i]] >= 1) {
                store.commit('ROBOT_REMOVE_CLICK', {
                    type: types[i]
                });
                craft(types[i]);
            }
        }
    }
});

// start loop
start();
