<template>
  <div>
    <base-dialog :show="!!error" title="An Error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <div class="spinner">
        <base-spinner></base-spinner>
      </div>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <transition name="blur-fade" mode="out-in">
          <div>
            <h2>{{ login }}</h2>
          </div>
        </transition>
        <!-- Email Input -->
        <div
          class="form-control"
          :class="{ invalid: emailError && !email.isValid }"
        >
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
              v-model.trim="email.val"
              id="email"
              class="floating-input"
              placeholder=""
              @blur="clearValidity(email, 'email')"
            />
            <label for="email" class="floating-label">Email</label>
          </div>

          <div v-if="emailError" class="error-msg">
            <Icon
              icon="line-md:alert-circle-loop"
              width="24"
              height="24"
              style="color: #f00"
            />
            <p>{{ emailError }}</p>
          </div>
        </div>

        <!-- Password Input -->
        <div
          class="form-control"
          :class="{ invalid: passwordError && !password.isValid }"
        >
          <div class="input-value">
            <Icon
              class="lock-icon"
              icon="solar:lock-keyhole-minimalistic-bold-duotone"
              width="1.6em"
              height="1.6em"
              style="color: #3a606e"
            />
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model.trim="password.val"
              id="password"
              class="floating-password-input"
              placeholder=""
              @blur="clearValidity(password, 'password')"
              @input="validatePassword"
            />
            <label for="password" class="floating-label">Password</label>
            <button type="button" @click="togglePassword" class="reveal-btn">
              <transition name="fade" mode="out-in">
                <Icon
                  v-if="showPassword"
                  icon="solar:eye-bold-duotone"
                  width="2em"
                  height="2em"
                  style="color: #3a606e"
                  key="eye"
                />
                <Icon
                  v-else
                  icon="mingcute:eye-close-line"
                  width="2em"
                  height="2em"
                  style="color: #3a606e"
                  key="eye-off"
                />
              </transition>
            </button>
          </div>
          <div v-if="passwordError" class="error-msg">
            <Icon
              icon="line-md:alert-circle-loop"
              width="24"
              height="24"
              style="color: #f00"
            />
            <p>{{ passwordError }}</p>
          </div>
        </div>

        <!-- Buttons -->
        <transition name="blur-fade" mode="out-in">
          <div class="login-section" :key="mode">
            <base-button :key="submitButtonCaption"
              >{{ submitButtonCaption }}
            </base-button>
            <div class="join-wrapper">
              <span class="auth-toggle" :key="authToggle">{{
                authToggle
              }}</span>
              <base-button
                :key="switchModeButtonCaption"
                type="button"
                mode="flat"
                class="new-acc"
                @click="switchAuthMode"
              >
                {{ switchModeButtonCaption }}
                <Icon
                  icon="solar:arrow-right-line-duotone"
                  width="25px"
                  height="25px"
                  class="arrow-icon"
                />
              </base-button>
            </div>
          </div>
        </transition>
      </form>
    </base-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useAuth } from "@/composables/useAuth";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { auth } = useAuth();

const formIsValid = ref<boolean>(true);
const login = ref("");
const mode = ref<string>("login");
const isLoading = ref<boolean>(false);
const error = ref<null | string>(null);
const showPassword = ref<boolean>(false);
const passwordError = ref<string>("");
const emailError = ref<string>("");
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const authToggle = ref<string>("");

type Field<T> = {
  val: T;
  isValid: boolean;
};

const email = reactive<Field<string>>({
  val: "",
  isValid: true,
});

const password = reactive<Field<string>>({
  val: "",
  isValid: true,
});

const clearValidity = (
  input: { isValid: boolean },
  type: "email" | "password"
) => {
  input.isValid = true;
  if (type === "email") emailError.value = "";
  if (type === "password") passwordError.value = "";
};

const submitForm = async () => {
  formIsValid.value = true;
  email.isValid = true;
  password.isValid = true;
  emailError.value = "";
  passwordError.value = "";

  // Email validation
  if (email.val === "" || !email.val.includes("@")) {
    emailError.value = "Please enter a valid email address.";
    email.isValid = false;
    formIsValid.value = false;
  }

  // Password validation
  if (!passwordPattern.test(password.val)) {
    passwordError.value =
      "Min 8 characters with a letter, number & special character.";
    password.isValid = false;
    formIsValid.value = false;
  }

  // ⛔ Stop here if form is invalid
  if (!formIsValid.value) {
    return;
  }

  isLoading.value = true;

  const actionPayload: { email: string; password: string } = {
    email: email.val,
    password: password.val,
  };

  try {
    await auth(
      actionPayload.email,
      actionPayload.password,
      mode.value === "login" ? "login" : "signup"
    );

    const redirectUrl = "/" + (route.query.redirect || "coaches");
    router.replace(redirectUrl);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to authenticate, try later.";
  }

  email.val = "";
  password.val = "";
  isLoading.value = false;
};

const validatePassword = () => {
  if (passwordPattern.test(password.val)) {
    passwordError.value = "";
    password.isValid = true;
  } else {
    passwordError.value =
      "Min 8 characters with a letter, number & special character.";
    password.isValid = false;
  }
};

const submitButtonCaption = computed(() => {
  if (mode.value === "login") {
    login.value = "Login";
    return "Login";
  } else {
    login.value = "Signup";
    return "Sign up";
  }
});

const switchModeButtonCaption = computed(() => {
  if (mode.value === "login") {
    authToggle.value = "New here?";
    return "Create account";
  } else {
    authToggle.value = "Already have an account?";
    return "Login";
  }
});

const switchAuthMode = () => {
  if (mode.value === "login") {
    mode.value = "signup";
    password.val = "";
    email.val = "";
  } else {
    mode.value = "login";
    password.val = "";
    email.val = "";
    authToggle.value = "Already have an account?";
  }
};

const handleError = () => {
  error.value = null;
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.form-control {
  position: relative;
  margin: 1rem auto;
}

.login-section {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  margin-bottom: 2rem;
}

form {
  /* padding: 1rem; */
  margin: 1rem;
}

.email-icon {
  position: absolute;
  right: 0.75rem;
  top: 75%;
  left: 1.3%;
  transform: translateY(-100%);
}

.lock-icon {
  position: absolute;
  right: 0.75rem;
  top: 75%;
  left: 1.3%;
  transform: translateY(-100%);
}

.new-acc {
  display: inline-flex;
  align-items: center;
}

.arrow-icon {
  vertical-align: middle;
  transition: transform 0.2s ease;
}

.new-acc:hover .arrow-icon {
  transform: translateX(5px);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.blur-fade-enter-active,
.blur-fade-leave-active {
  transition: all 0.3s ease;
}

.blur-fade-enter-from,
.blur-fade-leave-to {
  opacity: 0;
  filter: blur(8px);
  transform: scale(0.97);
}

.blur-fade-enter-to,
.blur-fade-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

.floating-input {
  width: 100%;
  display: block;
  border-radius: 5px;
  margin: 0;
  font: inherit;
  padding: 1.25rem 0.5rem 0.5rem 2.3rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ccc;
  background: #fff;
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.1);
  outline: none;
  transition: border-color 0.3s ease;
}

.floating-password-input {
  width: 100%;
  display: block;
  border-radius: 5px;
  font: inherit;
  padding: 1.25rem 0.5rem 0.5rem 2.3rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ccc;
  background: #fff;
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.1);
  outline: none;
  transition: border-color 0.3s ease;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-value {
  display: flex;
  position: relative;
  align-items: center;
}

.reveal-btn {
  position: absolute;
  right: 1rem;
  top: 20%;
  background: none;
  border: none;
  padding: 0;
  transform: translateX(0%);
  cursor: pointer;
  outline: none;
  transition: all 200ms ease-in;
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

.floating-input:focus,
.floating-password-input:focus {
  border-bottom-color: #3a616f;
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

.floating-password-input:focus + .floating-label,
.floating-password-input:not(:placeholder-shown) + .floating-label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #3a616f;
}

.invalid label {
  color: red;
}

.invalid span {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}

.error-msg {
  display: flex;
  align-items: center;
  font-size: small;
  gap: 7px;
  color: #f02;
}

/* Optional mobile tweak */
@media (max-width: 600px) {
  .floating-input {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-section {
    display: flex;
    flex-direction: column;
    margin-left: 0;
    margin-top: 1rem;
    gap: 2rem;
  }
}
</style>
