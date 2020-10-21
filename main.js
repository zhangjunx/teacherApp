import Vue from 'vue'
import App from './App'
import store from './store/'



Vue.config.productionTip = false
Vue.prototype.$url='https://www.dslxpt.com/EducationApp/app/'
Vue.prototype.$store=store

App.mpType = 'app'


const app = new Vue({
	store,
	...App
})
app.$mount()
