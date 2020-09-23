/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
//Including sweet alert
import swal from 'sweetalert2'
window.swal = swal;

const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});
window.toast = toast;

Vue.component('doctor-list', require('./components/DoctorList.vue').default);
Vue.component('diagnosis-list', require('./components/Diagnosis.vue').default);
Vue.component('patients-list', require('./components/Patients-list').default);

import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)

window.EventBus = new Vue();

const app = new Vue({
    el: '#app',
});
