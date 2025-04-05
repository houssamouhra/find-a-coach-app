<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <input
          type="text"
          id="email"
          class="floating-input"
          placeholder=""
          v-model.trim="email"
        />
        <label for="email" class="floating-label">Your Email</label>
      </div>
      <div class="form-control">
        <textarea
          id="message"
          placeholder=""
          rows="5"
          class="floating-input"
          v-model.trim="message"
        ></textarea>
        <label for="message" class="floating-label">Message</label>
      </div>
      <div class="error-msg" v-if="!formIsValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p class="errors">Please enter a valid email and non-empty message.</p>
      </div>
      <div class="actions">
        <base-button>Send Message</base-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRequests } from "@/stores/requests";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue/dist/iconify.js";
import type { Payload } from "@/stores/requests";

const route = useRoute();
const router = useRouter();

const requestsStore = useRequests();

const email = ref<string>("");
const message = ref<string>("");
const formIsValid = ref<boolean>(true);

const submitForm: any = computed(() => {
  formIsValid.value = true;
  if (
    email.value === "" ||
    !email.value.includes("@") ||
    message.value === ""
  ) {
    formIsValid.value = false;
    return;
  }
  requestsStore.contactCoach(<Payload>{
    email: email.value,
    message: message.value,
    coachId: route.params.id,
  });
  router.replace("/coaches");
});
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  position: relative;
  margin: 1rem auto;
}

.floating-input {
  width: 100%;
  padding: 1.25rem 0.5rem 0.5rem 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ccc;
  background: transparent;
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.1);
  outline: none;
  transition: border-color 0.3s ease;
}

.floating-label {
  position: absolute;
  top: 1rem;
  left: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #888;
  pointer-events: none;
  transition: all 0.3s ease;
}

.floating-input:focus {
  background-color: #ebeff1;
  border-color: #607b7d;
  outline: none;
}

.floating-input:focus + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #3a616f;
}

/* Optional mobile tweak */
@media (max-width: 600px) {
  .floating-input {
    font-size: 1rem;
  }
}

.error-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.errors {
  font-weight: 500;
  color: red;
}

.actions {
  text-align: center;
}
</style>
