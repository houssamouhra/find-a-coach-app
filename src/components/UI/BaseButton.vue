<template>
  <button v-if="!link">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

type Props = {
  mode?: string | null;
  link?: boolean;
  to?: string;
};

const props = withDefaults(defineProps<Props>(), {
  mode: null,
  link: false,
  to: "/",
});
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  font-weight: bold;
  background-color: #3a606e;
  border: 1px solid #3a606e;
  color: white;
  cursor: pointer;
  border-radius: 100px;
  margin-right: 0.5rem;
  display: inline-block;
  transition: all 300ms;
}

a:hover,
a:active,
button:hover,
button:active {
  color: #3a606e;
  background-color: #fff;
  border-color: #3a606e;
  transition: all 300ms;
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.flat {
  background-color: transparent;
  color: #3a606e;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #3a606e;
  color: #3a606e;
}

.outline:hover {
  color: #fff;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
  transition: all 0.3s ease;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #3a606e;
}
</style>
