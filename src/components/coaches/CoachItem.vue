<template>
  <li>
    <h3>{{ fullName }}</h3>
    <h4>${{ props.rate }}/hour</h4>
    <div>
      <base-badge
        v-for="area in props.areas"
        :key="area"
        :type="area"
        :title="area"
      ></base-badge>
    </div>
    <div class="actions">
      <base-button mode="outline" link :to="coachContactLink"
        >Contact</base-button
      >
      <base-button link :to="coachDetailsLink">View Details</base-button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useRoute } from "vue-router";

interface Props {
  id?: string | null;
  firstName: string;
  lastName: string;
  rate: number;
  areas: string[];
}

const props = defineProps<Props>();

const route = useRoute();

const fullName = computed(() => props.firstName + " " + props.lastName);
// prettier-ignore
const coachContactLink = computed(() => route.path + "/" + props.id + "/contact");
// prettier-ignore
const coachDetailsLink = computed(() => route.path + "/" + props.id);
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
