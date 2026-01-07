<script setup>
import { ref } from 'vue';
const props = defineProps(['note', 'index']);
const emit = defineEmits(['delete', 'update', 'toggle']);

const isEditing = ref(false);
const editContent = ref(props.note.content);

const saveEdit = () => {
  emit('update', props.index, editContent.value);
  isEditing.value = false;
};
</script>

<template>
  <li class="note-item">
    <div v-if="!isEditing" class="view-mode">
      <div class="content-group">
        <span class="category-pill" :class="note.category">{{ note.category }}</span>
        <span class="note-text" @click="emit('toggle', index)">{{ note.content }}</span>
      </div>
      
      <div class="action-group-vertical">
        <button class="btn-soft btn-done" @click="emit('toggle', index)">
          完成
        </button>
        
        <button class="btn-soft btn-edit" @click="isEditing = true">
          编辑
        </button>
        
        <button class="btn-soft btn-delete" @click="emit('delete', index)">
          删除
        </button>
      </div>
    </div>

    <div v-else class="edit-mode">
      <input v-model="editContent" @keyup.enter="saveEdit" class="edit-input" />
      <div class="edit-actions">
        <button class="btn-soft btn-save" @click="saveEdit">保存</button>
        <button class="btn-soft btn-cancel" @click="isEditing = false">取消</button>
      </div>
    </div>
  </li>
</template>

<style scoped>
/* 样式部分大部分保持不变，但可以删掉 .is-done 相关的样式了，因为不会出现已完成的项 */

.note-item {
  background: #ffffff; /* 确保是白色卡片 */
  margin-bottom: 16px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.05); /* 柔和阴影 */
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.note-item:hover {
  box-shadow: 0 12px 32px rgba(149, 157, 165, 0.15);
  transform: translateY(-2px);
}

.view-mode {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.content-group { flex: 1; padding-right: 20px; }

.category-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 8px;
  background: #eee; color: #666;
}
/* 分类颜色 */
.category-pill.灵感 { background: #fff0f6; color: #eb2f96; }
.category-pill.工作 { background: #e6f7ff; color: #1890ff; }
.category-pill.生活 { background: #f6ffed; color: #52c41a; }

.note-text {
  display: block;
  font-size: 16px;
  line-height: 1.6;
  cursor: pointer;
  color: #333;
}

/* 按钮竖排 */
.action-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-soft {
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-soft:hover { filter: brightness(0.95); }

/* 按钮配色 */
.btn-done { background: #f6ffed; color: #52c41a; }
.btn-edit { background: #e6f7ff; color: #0099ff; }
.btn-delete { background: #fff1f0; color: #ff4d4f; }

/* 编辑框样式 */
.edit-input {
  width: 100%; padding: 12px; border: 2px solid #eee;
  border-radius: 12px; margin-bottom: 12px; font-size: 16px;
  outline: none;
}
.edit-input:focus { border-color: #e6f7ff; }
.edit-actions { display: flex; gap: 10px; }
.btn-save { background: #0099ff; color: white; }
.btn-cancel { background: #f5f5f5; color: #666; }
</style>