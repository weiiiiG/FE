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
    <input v-model="text" @keyup.enter="submit" />
    <select v-model="category">
      <option v-for="c in props.categories" :value="c">{{ c }}</option>
    </select>
    <button @click="submit">添加</button>
  </div>
</template>