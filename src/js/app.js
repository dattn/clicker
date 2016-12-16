// include polyfills
import classListPolyfill from 'classlist-polyfill';

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
    var energy;
    for (let type in store.state.items) {
        const generate = item(type).generate;
        if (!generate || !generate.energy) {
            continue;
        }
        energy = generate.energy;
        if (energy < 0) {
            store.commit('BATTERY_DISCHARGE', { amount: -energy });
            continue;
        }
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
