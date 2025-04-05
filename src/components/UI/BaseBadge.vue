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
}

.frontend {
  background-color: #f27d71;
  color: white;
}

.backend {
  background-color: #927bbf;
  color: white;
}

.career {
  background-color: #eed25d;
  color: white;
}
</style>
