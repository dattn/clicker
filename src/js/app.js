import Vue from 'vue';
import Vuex from 'vuex';
import store from './store/store';
import AppVue from '../vue/app.vue';

// start virtual time
store.dispatch('startTime');

// wind force
store.dispatch('startWindForce');

// charge/discharge batteries
store.dispatch('startBatteryCharge');

export {
    store
}

new Vue({
    el: 'body',

    store,

    render: function (createElement) {
        return createElement(AppVue);
    }
});
