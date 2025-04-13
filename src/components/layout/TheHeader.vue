<template>
  <header>
    <nav>
      <h1><router-link to="/">Find a Coach</router-link></h1>
      <ul>
        <li>
          <router-link to="/coaches">All Coaches</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/requests">Requests</router-link>
        </li>
        <li v-else>
          <router-link to="/auth">Login</router-link>
        </li>
        <li v-if="isLoggedIn">
          <base-button @click="handleLogout">Logout</base-button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { logout } = useAuth();

const isLoggedIn = computed(() => authStore.isAuthenticated);

const handleLogout = () => {
  logout();
  router.replace("/coaches");
};
</script>

<style scoped>
header {
  width: 100%;
  height: 5rem;
  background-color: #3a606e;
  display: flex;
  justify-content: center;
  align-items: center;
}

header a {
  text-decoration: none;
  font-size: larger;
  font-weight: bold;
  color: #e8c547;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 50px;
  transition: all 500ms;
}

a:hover {
  border: 1px solid #828e82;
  border-radius: 50px;
  transition: all 500ms;
}

a:active,
a.router-link-active {
  color: #fedc97;
  border: 1px solid #e8c547;
  border-radius: 50px;
  transition: all 300ms;
}

h1 {
  margin: 0;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>
