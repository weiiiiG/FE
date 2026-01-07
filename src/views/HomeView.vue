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

// 额外的功能：手动点击捕捉灵感
const captureNewInspiration = async () => {
  try {
    const res = await axios.get('https://v1.hitokoto.cn');
    handleAdd({ text: `${res.data.hitokoto} —— 「${res.data.from}」`, category: '灵感' });
  } catch (e) {
    alert("网络拥堵，稍后再试");
  }
};

// --- 2. 搜索与分类：计算属性 ---
const filteredNotes = computed(() => {
  return notes.value.filter(note => {
    const matchText = note.content.toLowerCase().includes(searchText.value.toLowerCase());
    const matchCategory = selectedCategory.value === '全部' || note.category === selectedCategory.value;
    return matchText && matchCategory;
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
      <input v-model="searchText" placeholder="🔍 搜索便签..." class="search-bar" />
      <select v-model="selectedCategory">
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <button @click="captureNewInspiration" class="magic-btn">✨ 捕捉灵感</button>
    </div>

    <NoteInput @add="handleAdd" :categories="categories.slice(1)" />

    <div v-if="isLoading" class="loading">正在连接灵感星空...</div>
    <ul v-else class="note-list">
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
  </div>
</template>

<style scoped>
.home-container { max-width: 600px; margin: 0 auto; padding: 20px; }
.filter-section { display: flex; gap: 10px; margin-bottom: 20px; }
.search-bar { flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #ddd; }
.magic-btn { background: #6c5ce7; color: white; border: none; padding: 0 15px; border-radius: 6px; cursor: pointer; }
.magic-btn:hover { background: #a29bfe; }
.loading { text-align: center; color: #666; padding: 40px; }
.note-list { list-style: none; padding: 0; }
</style>