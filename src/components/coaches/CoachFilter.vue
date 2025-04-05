<template>
  <base-card>
    <h2>Find Your Coach</h2>
    <div class="filters">
      <div class="check-box">
        <label for="frontend" class="checkbox-icon">
          <input type="checkbox" id="frontend" checked @change="setFilter" />
          <span class="icon">
            <Icon icon="pajamas:check-xs" width="20" height="20" />
          </span>
          <span class="filter-option">Frontend</span>
        </label>
      </div>
      <div class="check-box">
        <label for="backend" class="checkbox-icon">
          <input type="checkbox" id="backend" checked @change="setFilter" />
          <span class="icon">
            <Icon icon="pajamas:check-xs" width="20" height="20" />
          </span>
          <span class="filter-option">Backend</span>
        </label>
      </div>
      <div class="check-box">
        <label for="career" class="checkbox-icon">
          <input type="checkbox" id="career" checked @change="setFilter" />
          <span class="icon">
            <Icon icon="pajamas:check-xs" width="20" height="20" />
          </span>
          <span class="filter-option">Career</span>
        </label>
      </div>
    </div>
  </base-card>
</template>

<script lang="ts" setup>
import { reactive, defineEmits } from "vue";
import { Icon } from "@iconify/vue";

interface Filter {
  frontend: boolean;
  backend: boolean;
  career: boolean;
}

let filters = reactive<Filter>({
  frontend: true,
  backend: true,
  career: true,
});

const emits = defineEmits(["change-filter"]);

const setFilter = (event: Event) => {
  const inputId = (event.target as HTMLInputElement).id;
  const isActive = (event.target as HTMLInputElement).checked;
  const updatedFilters = {
    ...filters,
    [inputId]: isActive,
  };
  filters = updatedFilters;
  emits("change-filter", updatedFilters);
};
</script>

<style scoped>
.filters {
  display: flex;
}

.checkbox-icon {
  display: flex;
  align-items: center;
  gap: 6px;
}

.checkbox-icon input {
  display: none;
}

.checkbox-icon .icon {
  display: flex;
  align-items: center;
  width: 22px;
  height: 22px;
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

h2 {
  margin: 0.5rem 0;
  margin-bottom: 1rem;
}

.filter-option {
  margin-right: 2rem;
}
</style>
