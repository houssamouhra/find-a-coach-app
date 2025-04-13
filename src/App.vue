<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useAuthStore } from "./stores/auth";
import TheHeader from "./components/layout/TheHeader.vue";
import router from "./router/router";

const authStore = useAuthStore();

onMounted(() => {
  authStore.tryLogin();
});

watch(
  () => authStore.didAutoLogout,
  (curVal, prevVal) => {
    if (curVal && curVal !== prevVal) {
      router.replace("/coaches");
    }
  }
);
</script>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"); */
/* 
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"); */

/* @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"); */

@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Lato", sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #f5f5f5;
  background: linear-gradient(to top, #ebeff1, #f5f5f5);
}

.route-enter-active,
.route-leave-active {
  transition: all 400ms ease;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
  filter: blur(8px);
  transform: scale(0.97);
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}
</style>
