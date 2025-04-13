<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <div class="input-value">
          <Icon
            class="email-icon"
            icon="solar:letter-line-duotone"
            width="1.6em"
            height="1.6em"
            style="color: #3a606e"
          />
          <input
            type="text"
            id="email"
            class="floating-input"
            placeholder=""
            v-model.trim="email"
          />
          <label for="email" class="floating-label">Email</label>
        </div>
      </div>
      <div class="form-control">
        <div class="input-value">
          <Icon
            class="desc-icon"
            icon="solar:document-text-bold-duotone"
            width="1.6em"
            height="1.6em"
            style="color: #3a606e"
          />
          <textarea
            id="message"
            placeholder=""
            rows="5"
            class="floating-input"
            v-model.trim="message"
          ></textarea>
          <label for="message" class="floating-label">Message</label>
        </div>
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
import { ref } from "vue";
import { useRequests } from "@/stores/requests";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue/dist/iconify.js";

const route = useRoute();
const router = useRouter();

const requestsStore = useRequests();

const email = ref<string>("");
const message = ref<string>("");
const formIsValid = ref<boolean>(true);

const submitForm = async () => {
  formIsValid.value = true;

  if (
    email.value === "" ||
    !email.value.includes("@") ||
    message.value === ""
  ) {
    formIsValid.value = false;
    return;
  }

  console.log("📬 submitForm triggered");

  try {
    await requestsStore.contactCoach(
      route.params.id as string,
      email.value,
      message.value
    );

    console.log("Sending to coach ID:", route.params.id);
    router.replace("/coaches");
  } catch (err) {
    formIsValid.value = false;
  }
};
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

.input-value {
  display: flex;
  position: relative;
  align-items: center;
}

.email-icon {
  position: absolute;
  right: 0.75rem;
  top: 75%;
  left: 1.3%;
  transform: translateY(-100%);
}

.desc-icon {
  position: absolute;
  right: 0.75rem;
  top: 75%;
  left: 1.2%;
  transform: translateY(-310%);
}

.floating-input {
  width: 100%;
  padding: 1.25rem 0.5rem 0.5rem 2.3rem;
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-bottom: 2px solid #ccc;
  background: transparent;
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.1);
  outline: none;
  transition: border-color 0.3s ease;
}

.floating-label {
  position: absolute;
  top: 1rem;
  left: 2.3rem;
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
  gap: 7px;
}

.errors {
  font-weight: small;
  color: red;
}

.actions {
  text-align: center;
}
</style>
