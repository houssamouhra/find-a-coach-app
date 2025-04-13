<template>
  <form @submit.prevent="submitForm">
    <!-- First Name -->
    <div class="form-control" :class="{ invalid: !firstName.isValid }">
      <div class="input-value">
        <Icon
          class="name-icon"
          icon="solar:user-rounded-bold-duotone"
          width="1.6em"
          height="1.6em"
          style="color: #3a606e"
        />
        <input
          type="text"
          id="firstname"
          class="floating-input"
          placeholder=""
          v-model.trim="firstName.val"
          @blur="clearValidity(firstName)"
        />
        <label for="firstname" class="floating-label">First name</label>
      </div>
      <div class="error-msg" v-if="!firstName.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>First name must not be empty</p>
      </div>
    </div>

    <!-- Last Name -->
    <div class="form-control" :class="{ invalid: !lastName.isValid }">
      <div class="input-value">
        <Icon
          class="name-icon"
          icon="solar:users-group-rounded-bold-duotone"
          width="1.6em"
          height="1.6em"
          style="color: #3a606e"
        />
        <input
          type="text"
          id="lastname"
          class="floating-input"
          placeholder=""
          v-model.trim="lastName.val"
          @blur="clearValidity(lastName)"
        />
        <label for="lastname" class="floating-label">Last name</label>
      </div>
      <div class="error-msg" v-if="!lastName.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>Last name must not be empty</p>
      </div>
    </div>

    <!-- Description -->
    <div class="form-control" :class="{ invalid: !description.isValid }">
      <div class="input-value">
        <Icon
          class="desc-icon"
          icon="solar:document-text-bold-duotone"
          width="1.6em"
          height="1.6em"
          style="color: #3a606e"
        />
        <textarea
          id="description"
          class="floating-input"
          placeholder=""
          rows="5"
          v-model.trim="description.val"
          @blur="clearValidity(description)"
        />
        <label for="description" class="floating-label">Description</label>
      </div>
      <div class="error-msg" v-if="!description.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>Description must not be empty</p>
      </div>
    </div>

    <!-- Hourly Rate -->
    <div class="form-control" :class="{ invalid: !rate.isValid }">
      <div class="input-value">
        <Icon
          class="hour-icon"
          icon="solar:hourglass-bold-duotone"
          width="1.6em"
          height="1.6em"
          style="color: #3a606e"
        />
        <input
          type="number"
          id="rate"
          class="floating-input"
          placeholder=""
          v-model.number="rate.val"
          @blur="clearValidity(rate)"
        />
        <label for="rate" class="floating-label">Hourly Rate</label>
      </div>

      <div class="error-msg" v-if="!rate.isValid">
        <Icon
          icon="line-md:alert-circle-loop"
          width="24"
          height="24"
          style="color: #f00"
        />
        <p>Rate must be greater than 0</p>
      </div>
    </div>

    <!-- Areas of Expertise -->
    <div class="form-control">
      <div class="exp-area" :class="{ invalid: !areas.isValid }">
        <h3>Areas of Expertise</h3>
        <div class="areas-grid">
          <div
            v-for="area in availableAreas"
            :key="area.value"
            :class="['area-card', { selected: areas.val.includes(area.value) }]"
            @click="toggleArea(area.value)"
          >
            <Icon
              :icon="area.icon"
              width="3rem"
              height="2rem"
              style="color: #3a606e"
            />
            <span>{{ area.label }}</span>
          </div>
        </div>
        <div class="error-msg" v-if="!areas.isValid">
          <p>At least one expertise must be selected!</p>
        </div>
      </div>
    </div>
    <p v-if="!formIsValid" style="color: #f00">
      Please fix the above errors and submit again
    </p>
    <div class="submit">
      <base-button class="register-btn">Register</base-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, defineEmits, reactive } from "vue";
import { Icon } from "@iconify/vue";

const emits = defineEmits(["save-data"]);

type Areas = {
  value: string;
  label: string;
  icon: string;
};

const availableAreas: Areas[] = [
  {
    value: "frontend",
    label: "Frontend Development",
    icon: "uim:html3-alt",
  },
  {
    value: "backend",
    label: "Backend Development",
    icon: "solar:database-bold-duotone",
  },
  {
    value: "career",
    label: "Career Advisory",
    icon: "solar:money-bag-bold-duotone",
  },
];

const toggleArea = (area: string) => {
  const index = areas.val.indexOf(area);
  if (index === -1) {
    areas.val.push(area);
  } else {
    areas.val.splice(index, 1);
  }
  clearValidity(areas);
};

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

type Formdata = {
  first: string;
  last: string;
  desc: string;
  rate: number | null;
  areas: string[];
};

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
  emits("save-data", data);
};
</script>

<style scoped>
.form-control {
  position: relative;
  margin: 2rem auto;
}

.input-value {
  display: flex;
  position: relative;
  align-items: center;
}

.floating-input {
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
  border-bottom-color: #3a616f;
}

.floating-input:focus .name-icon {
  color: #607b7d;
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

.name-icon {
  position: absolute;
  right: 0.75rem;
  top: 75%;
  left: 1.2%;
  transform: translateY(-100%);
}

.desc-icon {
  position: absolute;
  right: 0.75rem;
  top: 73%;
  left: 1.2%;
  transform: translateY(-310%);
}

.hour-icon {
  position: absolute;
  right: 0.75rem;
  top: 75%;
  left: 1.2%;
  transform: translateY(-95%);
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
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
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

.submit {
  margin-top: 1rem;
  margin-bottom: 0.2rem;
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

.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.area-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  background-color: #f9f9f9;
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.1);
  transition: all 300ms ease-in-out;
}

.area-card:hover {
  border-color: #3a616f;
  box-shadow: none;
  transition: all 300ms ease-in-out;
}

.area-card.selected {
  background-color: #ebeff1;
  border-color: #3a616f;
  box-shadow: 0 0 0 3px rgba(58, 97, 111, 0.3);
}

.exp-area {
  margin-top: 1.7rem;
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
  gap: 7px;
  color: #f00;
  font-size: small;
}
</style>
