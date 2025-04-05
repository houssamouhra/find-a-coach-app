<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: !firstName.isValid }">
      <input
        type="text"
        id="firstname"
        class="floating-input"
        placeholder=""
        v-model.trim="firstName.val"
        @blur="clearValidity(firstName)"
      />
      <label for="firstname" class="floating-label">First name</label>
      <div class="error-msg" v-if="!firstName.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>First name must not be empty.</p>
      </div>
    </div>
    <div class="form-control" :class="{ invalid: !lastName.isValid }">
      <input
        type="text"
        id="lastname"
        class="floating-input"
        placeholder=""
        v-model.trim="lastName.val"
        @blur="clearValidity(lastName)"
      />
      <label for="lastname" class="floating-label">Last name</label>
      <div class="error-msg" v-if="!lastName.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>Last name must not be empty.</p>
      </div>
    </div>
    <div class="form-control" :class="{ invalid: !description.isValid }">
      <textarea
        id="description"
        class="floating-input"
        placeholder=""
        rows="5"
        v-model.trim="description.val"
        @blur="clearValidity(description)"
      />
      <label for="description" class="floating-label">Description</label>
      <div class="error-msg" v-if="!description.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>Description must not be empty.</p>
      </div>
    </div>
    <div class="form-control" :class="{ invalid: !rate.isValid }">
      <input
        type="number"
        id="rate"
        class="floating-input"
        placeholder=""
        v-model.number="rate.val"
        @blur="clearValidity(rate)"
      />
      <label for="rate" class="floating-label">Hourly Rate</label>
      <div class="error-msg" v-if="!rate.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>Rate must not be greater than 0.</p>
      </div>
    </div>
    <div class="form-control">
      <div class="exp-area" :class="{ invalid: !areas.isValid }">
        <h3>Areas of Expertise</h3>
        <div>
          <label class="checkbox-icon">
            <input
              type="checkbox"
              value="frontend"
              v-model="areas.val"
              @change="clearValidity(areas)"
            />
            <span class="icon">
              <Icon icon="pajamas:check-xs" width="20" height="20" />
            </span>
            <span>Frontend Development</span>
          </label>
        </div>
        <div>
          <label class="checkbox-icon">
            <input
              type="checkbox"
              value="backend"
              v-model="areas.val"
              @change="clearValidity(areas)"
            />
            <span class="icon">
              <Icon icon="pajamas:check-xs" width="20" height="20" />
            </span>
            <span>Backend Development</span>
          </label>
        </div>
        <div>
          <label class="checkbox-icon">
            <input
              type="checkbox"
              value="career"
              v-model="areas.val"
              @change="clearValidity(areas)"
            />
            <span class="icon">
              <Icon icon="pajamas:check-xs" width="20" height="20" />
            </span>
            <span>Career Advisory</span>
          </label>
        </div>
        <div class="error-msg" v-if="!areas.isValid">
          <Icon
            icon="line-md:alert-circle-loop"
            width="24"
            height="24"
            style="color: #f00"
          />
          <p>At least one expertise must be selected!</p>
        </div>
      </div>
    </div>
    <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
    <base-button>Register</base-button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, defineEmits, reactive } from "vue";
import { Icon } from "@iconify/vue";

const emits = defineEmits(["save-data"]);

interface Field<T> {
  val: T;
  isValid: boolean;
}

const firstName = reactive<Field<string>>({
  val: "",
  isValid: true,
});

const lastName = reactive<Field<string>>({
  val: "",
  isValid: true,
});

const description = reactive<Field<string>>({
  val: "",
  isValid: true,
});

const rate = reactive<Field<number | null>>({
  val: null,
  isValid: true,
});

const areas = reactive<Field<any[]>>({
  val: [],
  isValid: true,
});

const clearValidity = (input: { isValid: boolean }) => {
  input.isValid = true;
};

const formIsValid = ref<boolean>(true);

const validateForm = () => {
  formIsValid.value = true;
  if (firstName.val === "") {
    firstName.isValid = false;
    formIsValid.value = false;
  }
  if (lastName.val === "") {
    lastName.isValid = false;
    formIsValid.value = false;
  }
  if (description.val === "") {
    description.isValid = false;
    formIsValid.value = false;
  }
  if (!rate.val || rate.val < 0) {
    rate.isValid = false;
    formIsValid.value = false;
  }
  if (areas.val.length === 0) {
    areas.isValid = false;
    formIsValid.value = false;
  }
};

interface Formdata {
  first: string;
  last: string;
  desc: string;
  rate: number | null;
  areas: string[];
}

//prettier-ignore
const formData = computed<Formdata>(()=>({
  first: firstName.val,
  last: lastName.val,
  desc: description.val,
  rate: rate.val,
  areas: areas.val,
}))

const submitForm = () => {
  validateForm();
  if (!formIsValid.value) {
    return;
  }
  const data = formData.value;
  console.log("Form submitted:", data);
  emits("save-data", data);
};
</script>

<style>
.form-control {
  position: relative;
  margin: 2rem auto;
}

.floating-input {
  width: 100%;
  display: block;
  border-radius: 5px;
  font: inherit;
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
  border-bottom-color: #3a616f;
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

.checkbox-icon {
  display: flex;
  font-weight: 500;
  margin-bottom: 0.6rem;
  align-items: center;
  column-gap: 5px;
}

.checkbox-icon input {
  display: none;
}

.checkbox-icon .icon {
  display: inline-flex;
  width: 23px;
  height: 23px;
  border: 2px solid #3a616f;
  border-radius: 4px;
  color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-icon input:checked + .icon {
  background-color: #3a616f;
  color: white;
}

.form-control {
  margin: 0.5rem 0;
}

button {
  margin-top: 1rem;
}

input[type="checkbox"] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

.floating-input:focus {
  background-color: #ebeff1;
  border-color: #607b7d;
  outline: none;
}

input[type="checkbox"] {
  width: auto;
  border: none;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.exp-area {
  margin-top: 1.3rem;
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
  gap: 5px;
  color: #f00;
}
</style>
