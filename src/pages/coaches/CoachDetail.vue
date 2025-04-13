<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        ></base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCoaches } from "@/stores/coaches";
import { defineProps, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const router = useRouter();
const coachStore = useCoaches();

type Coach = {
  id?: string;
  firstName: string;
  lastName: string;
  areas: string[];
  description: string;
  hourlyRate: number;
};

const props = defineProps<{ id: string }>();

//prettier-ignore
onMounted(async () => {
  if (coachStore.coaches.length === 0) {
    await coachStore.loadCoaches();
  }
});

const contactLink = computed(
  () =>
    router.resolve({
      name: "coach-contact",
      params: { id: props.id },
    }).href
);

const selectedCoach = computed(
  () => coachStore.coaches.find((coach) => coach.id === props.id) || null
);

const areas = computed(() => selectedCoach.value?.areas);
const rate = computed(() => selectedCoach.value?.hourlyRate);
const description = computed(() => selectedCoach.value?.description);

//prettier-ignore
const fullName = computed(() => selectedCoach.value?.firstName + " " + selectedCoach.value?.lastName);
</script>
