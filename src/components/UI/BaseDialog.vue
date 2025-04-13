<template>
  <teleport to="body">
    <div v-if="props.show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="props.show">
        <header>
          <slot name="header">
            <h2>{{ props.title }}</h2>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
        <menu v-if="!props.fixed">
          <slot name="actions">
            <base-button @click="tryClose">Close</base-button>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from "vue";

type PropsType = {
  show?: boolean;
  title?: string;
  fixed?: boolean;
};

const props = withDefaults(defineProps<PropsType>(), {
  title: "",
  fixed: false,
});

const emit = defineEmits<{
  (event: "close"): void;
}>();

const tryClose = (): void => {
  if (props.fixed) {
    return;
  }
  emit("close");
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
}

header {
  background-color: #3a606e;
  color: white;
  width: 100%;
  padding: 1rem;
}

header h2 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 300ms ease-out;
}

.dialog-leave-active {
  transition: all 300ms ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
