<script setup>
import { ref, onMounted } from 'vue';

const historyNotes = ref([]);

onMounted(() => {
  const saved = localStorage.getItem('vue_notes');
  if (saved) {
    const allNotes = JSON.parse(saved);
    // 只过滤出已完成的（done 为 true）
    historyNotes.value = allNotes.filter(note => note.done === true);
  }
});
</script>

<template>
  <div class="container">
    <h2>📜 灵感历史（已完成）</h2>
    <div v-if="historyNotes.length > 0">
      <div v-for="note in historyNotes" :key="note.id" class="history-card">
        <span class="tag">{{ note.category }}</span>
        <p>{{ note.content }}</p>
      </div>
    </div>
    <p v-else>还没有已完成的灵感哦，快去行动吧！</p>
  </div>
</template>