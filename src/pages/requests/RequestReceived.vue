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
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>
        <div class="spinner" v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasRequests && !isLoading">
          <request-item
            v-for="req in receivedRequests"
            :key="req.id"
            :email="req.userEmail"
            :message="req.message"
          ></request-item>
        </ul>
        <h3 v-else>You haven't received any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import RequestItem from "@/components/requests/RequestItem.vue";
import { ref, computed, onMounted } from "vue";
import { useRequests } from "@/stores/requests";

const requestsStore = useRequests();

const receivedRequests = computed(() => requestsStore.receivedRequests);

const hasRequests = computed(() => requestsStore.hasRequests);

const isLoading = ref<boolean>(false);
const error = ref<null>(null);

onMounted(() => {
  loadRequests();
});

const loadRequests = async () => {
  isLoading.value = true;
  try {
    await requestsStore.fetchRequests();
  } catch (err: any) {
    error.value = err.message || "Something failed!";
  }
  isLoading.value = false;
};

const handleError = () => {
  error.value = null;
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
