<script setup>
// 逻辑部分不变
</script>

<template>
  <nav class="nav-bar fixed-nav">
    <div class="nav-content">
      <router-link to="/">🏠 我的便签</router-link>
      <span class="divider">|</span>
      <router-link to="/history">📜 历史记录</router-link>
    </div>
  </nav>

  <div class="main-wrapper">
    <router-view></router-view>
  </div>
</template>

<style>
/* 全局重置 */
body { margin: 0; background-color: var(--bg-soft); }

/* --- 核心：浮动导航栏样式 --- */
.fixed-nav {
  position: fixed;       /* 固定在顶部 */
  top: 0;
  left: 0;
  width: 100%;           /* 占满宽度 */
  z-index: 1000;         /* 确保在最上层 */
  
  /* 磨砂玻璃效果 */
  background: rgba(255, 255, 255, 0.7); 
  backdrop-filter: blur(20px);          /* 模糊背后的内容 */
  -webkit-backdrop-filter: blur(20px);  /* 兼容 Safari */
  
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.nav-content {
  max-width: 600px;      /* 内容宽度与页面一致 */
  margin: 0 auto;
  height: 64px;          /* 导航栏高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.divider { margin: 0 20px; color: #ddd; }

/* 链接样式 */
a { text-decoration: none; color: var(--text-secondary); transition: color 0.3s; }
.router-link-active { color: var(--color-blue-text); }

/* --- 内容垫片 --- */
.main-wrapper {
  padding-top: 80px; /* 留出比导航栏(64px)多一点的空间 */
  min-height: 100vh;
}
</style>