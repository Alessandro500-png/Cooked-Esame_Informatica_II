import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import App from './App.vue'
import router from './router/index'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createApp(App).use(router).mount('#app')
