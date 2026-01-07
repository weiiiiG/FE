<template>
  <nav class="nav-bar">
    <router-link to="/">🏠 我的便签</router-link> | 
    <router-link to="/history">📜 历史记录</router-link>
  </nav>
  <router-view></router-view>
</template>
<style>
.nav-bar { padding: 20px; text-align: center; background: #fff; border-bottom: 1px solid #eee; }
.router-link-active { color: #1890ff; font-weight: bold; } /* 激活状态样式 */
</style>
