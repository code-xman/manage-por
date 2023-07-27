import { defineConfig } from 'vite';
// element 自动按需引入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';

import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // 开发服务
  server: {
    host: '0.0.0.0', // 如需内网共享访问，可设置为 0.0.0.0
    port: 8080, // 默认端口
    open: false, // 开发服务启动成功自动在浏览器中打开
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `
          @import "@/styles/const.scss";
          @import "@/styles/index.scss";
        `,
      },
    },
  },
  resolve: {
    // 别名配置
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.json', '.vue'], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  plugins: [
    vue(),
    // element 自动按需引入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
