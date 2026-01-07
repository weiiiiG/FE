<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import NoteInput from '../components/NoteInput.vue';
import NoteItem from '../components/NoteItem.vue';

// --- 状态定义 ---
const notes = ref([]);
const searchText = ref(''); // 搜索文本
const selectedCategory = ref('全部'); // 选中的分类
const categories = ['全部', '工作', '学习', '生活', '灵感'];
const isLoading = ref(false); // 新增：加载状态

// --- 1. 核心：结合 API 的数据获取流程 ---
const fetchNotes = async () => {
  isLoading.value = true;
  try {
    // 检查本地是否有存货
    const saved = localStorage.getItem('vue_notes');
    
    if (saved && JSON.parse(saved).length > 0) {
      // 流程 A：有本地数据，直接加载
      notes.value = JSON.parse(saved);
    } else {
      // 流程 B：无本地数据，通过 Axios 从 Hitokoto API 获取初始灵感
      const response = await axios.get('https://v1.hitokoto.cn');
      const { hitokoto, from } = response.data;
      
      notes.value = [
        { 
          id: Date.now(), 
          content: `${hitokoto} —— 「${from}」`, 
          done: false, 
          category: '灵感' 
        }
      ];
      saveToLocal(); // 存入本地
    }
  } catch (error) {
    console.error("获取 API 数据失败", error);
    // 兜底方案
    notes.value = [{ id: 1, content: '记录你的第一个想法吧！', done: false, category: '灵感' }];
  } finally {
    isLoading.value = false;
  }
};

// src/views/HomeView.vue

const captureNewInspiration = async () => {
  isLoading.value = true; // 1. 开始加载，文字变成 "连接宇宙中..."，下方显示云朵提示
  try {
    // 2. 发起请求 (这个通常很快，几百毫秒就结束了)
    const res = await axios.get('https://v1.hitokoto.cn');
    
    // --- 重点：人为添加 2 秒延迟 ---
    // 这行代码的意思是：在这里强行暂停 2000 毫秒，什么都不做
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    
    // 3. 延迟结束，添加数据
    handleAdd({ 
      text: `${res.data.hitokoto} —— 「${res.data.from}」`, 
      category: '灵感' 
    });
    
  } catch (e) {
    alert("网络拥堵，稍后再试");
  } finally {
    isLoading.value = false; // 4. 只有等那 2 秒过去后，这里才会执行，Loading 状态才会消失
  }
};

// --- 2. 搜索与分类：计算属性 ---
// --- 重点修改这里：计算属性 ---
const filteredNotes = computed(() => {
  return notes.value.filter(note => {
    // 1. 匹配搜索文本
    const matchText = note.content.toLowerCase().includes(searchText.value.toLowerCase());
    // 2. 匹配分类
    const matchCategory = selectedCategory.value === '全部' || note.category === selectedCategory.value;
    // 3. 新增：必须是“未完成”状态
    const isNotDone = !note.done; 
    
    return matchText && matchCategory && isNotDone;
  });
});

// --- 3. CRUD 逻辑 ---
const handleAdd = (data) => {
  notes.value.unshift({
    id: Date.now(),
    content: data.text,
    category: data.category,
    done: false
  });
  saveToLocal();
};

const handleDelete = (index) => {
  // 注意：删除时要根据原数组索引操作，或者根据 ID 过滤
  notes.value.splice(index, 1);
  saveToLocal();
};

const handleUpdate = (index, newContent) => {
  notes.value[index].content = newContent;
  saveToLocal();
};

// 切换完成状态逻辑
const handleToggle = (index) => {
  // 注意：如果是通过 filteredNotes 渲染的，建议通过 ID 来查找原数组索引更安全
  // 这里简化演示，直接操作 notes
  notes.value[index].done = !notes.value[index].done;
  saveToLocal(); // 每次修改都要保存，否则刷新页面状态会丢失
};

const saveToLocal = () => {
  localStorage.setItem('vue_notes', JSON.stringify(notes.value));
};

// 绑定生命周期：页面加载时执行
onMounted(fetchNotes);
</script>

<template>
  <div class="home-container">
    
    <div class="filter-section">
      <input v-model="searchText" placeholder="🔍 搜索我的想法..." class="search-bar" />
      <select v-model="selectedCategory">
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="inspiration-box">
      <span class="inspiration-text">✨ 试试随机来源灵感</span>
      <button @click="captureNewInspiration" class="magic-btn" :disabled="isLoading">
        {{ isLoading ? '连接宇宙中...' : '捕捉灵感' }}
      </button>
    </div>

    <NoteInput @add="handleAdd" :categories="categories.slice(1)" />
    
    <ul class="note-list">
  
      <li v-if="isLoading" class="loading-card">
          <span class="loading-icon">☁️</span>
        <span class="loading-text">正在连接宇宙信号...</span>
      </li>

     <NoteItem 
        v-for="(item, index) in filteredNotes" 
        :key="item.id"
        :note="item"
        :index="index"
        @delete="handleDelete"
        @update="handleUpdate"
        @toggle="handleToggle" 
      />
    </ul>

<div v-if="!isLoading && filteredNotes.length === 0" class="empty-tip">
  这里空空如也，快去记录吧！
</div>
    

  </div>
</template>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.filter-section { display: flex; gap: 12px; margin-bottom: 20px; }

/* 重点修改：搜索框和下拉框改为纯白 + 边框 */
.search-bar, select {
  padding: 12px 16px;
  border-radius: 16px;
  background: #ffffff;        /* 纯白背景 */
  border: 2px solid #f0f0f0;  /* 浅淡边框 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  font-size: 14px;
  transition: all 0.3s;
  color: #333;
}

.search-bar:focus, select:focus {
  border-color: #e6f7ff;
  outline: none;
}

.search-bar { flex: 1; }

/* 灵感盒子样式保持一致 */
.inspiration-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff; /* 也改成白色 */
  padding: 8px 8px 8px 20px;
  border-radius: 18px;
  border: 2px solid #f0f0f0;
  margin-bottom: 20px;
}
.inspiration-text { font-size: 14px; color: #888; }

/* 魔法按钮样式优化 */
.magic-btn {
  /* 渐变紫 */
  background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 14px; /* 和输入框按钮一致的圆角 */
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(114, 46, 209, 0.3);
}
.magic-btn:hover {
  box-shadow: 0 6px 15px rgba(114, 46, 209, 0.4);
  transform: translateY(-1px);
}
.magic-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  box-shadow: none;
}

.note-list { 
  list-style: none; 
  padding: 0; 
}

/* --- 核心修改：加载卡片样式 --- */
.loading-card {
  /* 1. 复刻 NoteItem 的卡片容器样式 */
  background: #ffffff;
  margin-bottom: 16px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.05);
  border: 1px solid transparent;
  
  /* 2. 让内部文字居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #888;
  font-size: 15px;
  
  /* 3. 加个呼吸灯动画，让它看起来是活的 */
  animation: breathe 1.5s infinite ease-in-out;
}

.loading-icon {
  font-size: 18px;
}

/* 定义呼吸动画：透明度忽明忽暗 */
@keyframes breathe {
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.98); }
}
</style>