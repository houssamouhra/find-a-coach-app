<template>
  <li>
    <div>
      <a :href="emailLink">{{ email }}</a>
    </div>
    <p>{{ message }}</p>
  </li>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

type PropsType = {
  email: string;
  message: string;
};

const props = defineProps<PropsType>();

const emailLink = computed(() => {
  return "mailto:" + props.email;
});
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #3a606e;
  border-bottom: 3px solid #3a606e;
  border-radius: 5px;
  padding: 1rem;
}

a {
  color: #17769b;
  text-decoration: none;
  font-weight: bold;
}

a:hover,
a:active {
  color: #3a606e;
}

p {
  margin: 0.5rem 0 0 0;
}
</style>
