import Vue from 'vue';
import Vuex from 'vuex';
import store from './store/store';

const Main = require('../vue/main.vue');

new Vue({
    el: '#Main',

    store,

    render: function (createElement) {
        return createElement(Main);
    }
});

// discharge batteries
setInterval(() => store.commit('BATTERY_DISCHARGE', { amount: 1 }), 1000);
