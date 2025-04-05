<template>
  <div>
    <section>
      <base-card>
        <h2>Register as a coach now!</h2>
        <coach-form @save-data="saveData"></coach-form>
      </base-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCoaches } from "@/stores/coaches";
import { useRouter } from "vue-router";
import CoachForm from "@/components/coaches/coachForm.vue";

const router = useRouter();
const coachStore = useCoaches();

const saveData = (formData: {
  first: string;
  last: string;
  desc: string;
  rate: number;
  areas: string[];
}) => {
  coachStore.registerCoach(formData);
  router.replace("/coaches");
};
</script>

<style scoped></style>
