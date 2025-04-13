<template>
  <span class="badge" :class="type">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
const props = defineProps<{
  type?: string;
  title?: string;
}>();

const text = computed(() => props.title);
</script>

<style scoped>
.badge {
  background-color: #ccc;
  color: #252525;
  border-radius: 30px;
  padding: 3px 10px;
  display: inline-block;
  margin-right: 0.5rem;
  transition: all 300ms;
}

.badge:hover {
  transform: scale(1.05);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  transition: all 300ms;
}

.frontend {
  background-color: #fff7e6;
  color: #ff9800;
}

.backend {
  background-color: #f9e6f0;
  color: #6a0f49;
}

.career {
  background-color: #e5f6f7;
  color: #2e6e74;
}
</style>
