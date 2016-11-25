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

// start virtual time
store.dispatch('startTime');

// charge/discharge batteries
store.dispatch('startBatteryCharge');
