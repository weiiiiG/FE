<script setup>
import { ref } from 'vue';
const props = defineProps(['categories']);
const emit = defineEmits(['add']);

const text = ref('');
const category = ref('生活');

const submit = () => {
  if (!text.value.trim()) return;
  emit('add', { text: text.value, category: category.value });
  text.value = '';
};
</script>

<template>
  <div class="input-group">
    <input v-model="text" @keyup.enter="submit" placeholder="写下新的灵感..." />
    
    <div class="right-actions">
      <select v-model="category">
        <option v-for="c in props.categories" :value="c">{{ c }}</option>
      </select>
      <button @click="submit">添加</button>
    </div>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  /* 重点修改：背景改为纯白，加边框 */
  background: #ffffff; 
  padding: 8px;
  border-radius: 18px;
  border: 2px solid #f0f0f0; /* 浅淡的边框 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  transition: border-color 0.3s;
}

/* 聚焦时边框变蓝 */
.input-group:focus-within {
  border-color: #e6f7ff;
}

input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 15px;
  min-width: 0; /* 防止 flex 子项溢出 */
}

.right-actions {
  display: flex;
  align-items: center;
  border-left: 1px solid #eee; /* 分割线 */
  padding-left: 8px;
}

select {
  border: none;
  background: transparent;
  padding: 0 10px;
  color: #666;
  cursor: pointer;
  height: 100%;
}

button {
  background: var(--color-blue-text);
  color: white;
  padding: 8px 20px;
  border-radius: 14px;
  font-weight: 600;
  white-space: nowrap; /* 防止按钮换行 */
}
</style>