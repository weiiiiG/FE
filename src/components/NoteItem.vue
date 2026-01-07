<script setup>
import { ref } from 'vue';
const props = defineProps(['note', 'index']);
const emit = defineEmits(['delete', 'update']);

const isEditing = ref(false);
const editContent = ref(props.note.content);

const saveEdit = () => {
  emit('update', props.index, editContent.value);
  isEditing.value = false;
};
</script>
<template>
  <li class="note-item">
    <div v-if="!isEditing">
      <span class="category-tag">{{ note.category }}</span>
      <span>{{ note.content }}</span>
      <button @click="isEditing = true">编辑</button>
      <button @click="emit('delete', index)">删除</button>
    </div>
    <div v-else>
      <input v-model="editContent" @keyup.enter="saveEdit" />
      <button @click="saveEdit">保存</button>
      <button @click="isEditing = false">取消</button>
    </div>
  </li>
</template>
<style scoped>
.category-tag { background: #e6f7ff; color: #1890ff; padding: 2px 6px; border-radius: 4px; margin-right: 8px; font-size: 12px; }
</style>