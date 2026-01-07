<script setup>
import { ref, onMounted } from 'vue';

const historyNotes = ref([]);
const allNotes = ref([]); // 保存完整数据以便操作

// 初始化加载
const loadData = () => {
  const saved = localStorage.getItem('vue_notes');
  if (saved) {
    allNotes.value = JSON.parse(saved);
    // 过滤出 done 为 true 的项目
    historyNotes.value = allNotes.value.filter(n => n.done === true);
  }
};

// 1. 核心功能：撤回 (把 done 改回 false)
const handleRecall = (id) => {
  // 在总表中找到这一项
  const targetNote = allNotes.value.find(n => n.id === id);
  if (targetNote) {
    targetNote.done = false; // 标记为未完成
    saveAndRefresh();        // 保存并刷新
  }
};

// 2. 核心功能：永久删除
const handleDelete = (id) => {
  if(confirm("确定要永久删除这条历史记录吗？")) {
    // 从总表中移除
    const index = allNotes.value.findIndex(n => n.id === id);
    if (index !== -1) {
      allNotes.value.splice(index, 1);
      saveAndRefresh();
    }
  }
};

const saveAndRefresh = () => {
  localStorage.setItem('vue_notes', JSON.stringify(allNotes.value));
  loadData(); // 重新加载数据，界面会自动更新
};

onMounted(loadData);
</script>

<template>
  <div class="history-container">
    <div class="header">
      <h2>📜 历史档案馆</h2>
      <span class="subtitle">已完成 {{ historyNotes.length }} 项</span>
    </div>

    <ul v-if="historyNotes.length > 0" class="history-list">
      <li v-for="note in historyNotes" :key="note.id" class="history-card">
        
        <div class="info-group">
          <span class="category-tag">{{ note.category }}</span>
          <span class="content done-text">{{ note.content }}</span>
          <span class="time-stamp">已归档</span>
        </div>

        <div class="action-group">
          <button class="btn-icon btn-recall" @click="handleRecall(note.id)" title="撤回至待办">
            ↩︎ 撤回
          </button>
          <button class="btn-icon btn-delete" @click="handleDelete(note.id)" title="永久删除">
            ✕
          </button>
        </div>
      </li>
    </ul>

    <div v-else class="empty-state">
      <div class="empty-icon">🍃</div>
      <p>暂无历史记录，去首页完成几个目标吧！</p>
    </div>
  </div>
</template>

<style scoped>
/* 1. 容器样式：复刻 HomeView 的居中风格 */
.history-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 25px;
  text-align: center;
}
h2 { margin: 0; color: var(--text-primary); font-size: 24px; }
.subtitle { color: #999; font-size: 14px; margin-top: 5px; display: block; }

.history-list { list-style: none; padding: 0; }

/* 2. 卡片样式：复刻 NoteItem 但更紧凑 */
.history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff; /* 纯白背景 */
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03); /* 极柔和的阴影 */
  border: 1px solid #f9f9f9;
  transition: all 0.3s;
}

.history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

/* 左侧内容 */
.info-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-tag {
  align-self: flex-start;
  font-size: 12px;
  padding: 2px 8px;
  background: #f5f5f5;
  color: #888;
  border-radius: 10px;
}

.done-text {
  text-decoration: line-through;
  color: #aaa;
  font-size: 16px;
}

.time-stamp { font-size: 12px; color: #ddd; }

/* 右侧按钮组 */
.action-group {
  display: flex;
  flex-direction: column; /* 竖排排列，符合你的新风格 */
  gap: 8px;
  margin-left: 15px;
}

.btn-icon {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* 撤回按钮：柔和的橙色/黄色 */
.btn-recall {
  background: #fff7e6;
  color: #fa8c16;
}
.btn-recall:hover { background: #ffd591; color: #d46b08; }

/* 删除按钮：柔和红 */
.btn-delete {
  background: #fff1f0;
  color: #ff4d4f;
}
.btn-delete:hover { background: #ffccc7; }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #ccc;
}
.empty-icon { font-size: 48px; margin-bottom: 10px; opacity: 0.5; }
</style>