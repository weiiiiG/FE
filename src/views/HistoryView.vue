<script setup>
import { ref, onMounted } from 'vue';

const historyNotes = ref([]);

onMounted(() => {
  // 从 LocalStorage 读取，并只显示已完成的
  const allNotes = JSON.parse(localStorage.getItem('vue_notes')) || [];
  historyNotes.value = allNotes.filter(n => n.done === true);
});
</script>
<template>
  <div class="container">
    <h2>📜 已完成的灵感</h2>
    <ul v-if="historyNotes.length">
      <li v-for="note in historyNotes" :key="note.id" class="history-item">
        <span>✅ {{ note.content }}</span>
      </li>
    </ul>
    <p v-else>还没有完成的记录哦，加油！</p>
  </div>
</template>
<style scoped>
.container { max-width: 400px; margin: 20px auto; }
.history-item { padding: 10px; border-bottom: 1px solid #f5f5f5; color: #888; }
</style>
