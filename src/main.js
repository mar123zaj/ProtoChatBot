import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';

Vue.config.productionTip = false;

let vm = new Vue({
  render: h => h(App),
}).$mount('#app');
global.vm = vm