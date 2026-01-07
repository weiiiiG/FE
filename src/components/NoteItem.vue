<script setup>
import { ref } from 'vue';
const props = defineProps(['note', 'index']);
const emit = defineEmits(['delete', 'update', 'toggle']); // 新增 toggle 事件

const isEditing = ref(false);
const editContent = ref(props.note.content);

const saveEdit = () => {
  emit('update', props.index, editContent.value);
  isEditing.value = false;
};
</script>

<template>
  <li class="note-item" :class="{ 'is-done': note.done }">
    <div v-if="!isEditing" class="content-row">
      <div class="text-group">
        <span class="category-tag">{{ note.category }}</span>
        <span class="note-text" @click="emit('toggle', index)">{{ note.content }}</span>
      </div>
      
      <div class="actions">
        <button @click="emit('toggle', index)" class="done-btn">
          {{ note.done ? '撤回' : '完成' }}
        </button>
        <button v-if="!note.done" @click="isEditing = true">编辑</button>
        <button @click="emit('delete', index)" class="delete-btn">删除</button>
      </div>
    </div>

    <div v-else class="edit-row">
      <input v-model="editContent" @keyup.enter="saveEdit" />
      <button @click="saveEdit">保存</button>
      <button @click="isEditing = false">取消</button>
    </div>
  </li>
</template>

<style scoped>
.note-item { padding: 12px; border-bottom: 1px solid #eee; transition: all 0.3s; }
.is-done .note-text { text-decoration: line-through; color: #aaa; }
.content-row { display: flex; justify-content: space-between; align-items: center; }
.category-tag { background: #e6f7ff; color: #1890ff; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
.done-btn { color: #52c41a; }
.delete-btn { color: #ff4d4f; }
.note-text { cursor: pointer; flex: 1; }
</style>