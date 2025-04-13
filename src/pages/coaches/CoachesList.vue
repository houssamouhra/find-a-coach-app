<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <button title="Refresh" @click="loadCoaches(true)">
            <!-- prettier-ignore -->
            <Icon icon="solar:refresh-square-bold-duotone" width="40" height="40"/>
          </button>
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login to register as a coach</base-button
          >
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</base-button
          >
        </div>
        <div class="spinner" v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id ?? coach.firstName"
            :id="coach.id"
            :first-name="coach.firstName"
            :last-name="coach.lastName"
            :areas="coach.areas"
            :rate="coach.hourlyRate"
          ></coach-item>
        </ul>
        <h3 v-else>No coaches found!</h3>
      </base-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import CoachItem from "@/components/coaches/CoachItem.vue";
import CoachFilter from "@/components/coaches/CoachFilter.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useCoaches } from "@/stores/coaches";
import { useAuthStore } from "@/stores/auth";
import { Icon } from "@iconify/vue";

const coachesStore = useCoaches();
const authStore = useAuthStore();

const filteredCoaches = computed(() => {
  const coaches = coachesStore.coaches;
  return coaches.filter((coach) => {
    const areas = coach.areas || [];
    if (activeFilters.frontend && areas.includes("frontend")) {
      return true;
    }
    if (activeFilters.backend && areas.includes("backend")) {
      return true;
    }
    if (activeFilters.career && areas.includes("career")) {
      return true;
    }
    return false;
  });
});

const hasCoaches = computed(() => {
  return !isLoading.value && coachesStore.coaches.length > 0;
});

type Filters = {
  frontend: boolean;
  backend: boolean;
  career: boolean;
};

const isLoading = ref<boolean>(false);
const error = ref<null>(null);

const activeFilters = reactive<Filters>({
  frontend: true,
  backend: true,
  career: true,
});

onMounted((): void => {
  loadCoaches();
});

const setFilters = (updatedFilters: Filters) => {
  activeFilters.frontend = updatedFilters.frontend;
  activeFilters.backend = updatedFilters.backend;
  activeFilters.career = updatedFilters.career;
};

const isLoggedIn = authStore.isAuthenticated;
const isCoach = coachesStore.isCoach;

const loadCoaches = async (refresh: boolean = false) => {
  isLoading.value = true;
  try {
    await coachesStore.loadCoaches(refresh);
  } catch (err: any) {
    error.value = err.message || "Something went wrong!";
  }
  isLoading.value = false;
};

const handleError = () => {
  error.value = null;
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}

button {
  all: unset;
  display: flex;
}

svg {
  color: #3a616f;
  cursor: pointer;
  transition: all 200ms;
}

svg:hover {
  color: #61818c;
  transition: all 200ms;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
