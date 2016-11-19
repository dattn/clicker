import Vue from 'vue';
const MainVue = require('../vue/main.vue')

new Vue({
    el: '#Main',

    render: function (createElement) {
        return createElement(MainVue);
    }
});
