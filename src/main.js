import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入我们之前定义的路由配置文件
import './style.css'         // 引入全局样式

const app = createApp(App)

// 关键步骤：使用路由插件
app.use(router)

// 挂载到 index.html 中的 <div id="app"></div>
app.mount('#app')