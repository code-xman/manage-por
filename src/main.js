import { createApp } from 'vue';
// element 全局引入 --> 自动按需引入
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';

// css
// import './style.css';
import './styles/layout.scss';
// element 样式
import 'element-plus/dist/index.css';
// import 'element-plus/es/components/message/style/css'
// 全局共用样式
// import './styles/index.scss';
import './styles/changeElement.scss';

// app
import App from './App.vue';
// 路由
import router from '@/router';

createApp(App)
  .use(router)
  .mount('#app');
