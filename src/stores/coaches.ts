import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export interface CoachInterface {
  id?: string | null;
  firstName: string;
  lastName: string;
  areas: string[];
  description: string;
  hourlyRate: number;
}

interface NewCoachData {
  first: string;
  last: string;
  desc: string;
  rate: number;
  areas: string[];
}

export const useCoaches = defineStore("coaches", () => {
  const coaches = ref<CoachInterface[]>([
    {
      id: "c1",
      firstName: "Trevor",
      lastName: "Philips",
      areas: ["frontend"],
      description:
        "I'm Trevor and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
      hourlyRate: 20,
    },
    {
      id: "c2",
      firstName: "Alex",
      lastName: "Jones",
      areas: ["backend", "career"],
      description:
        "I am Alex and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.",
      hourlyRate: 30,
    },
  ]);

  const lastFetch = ref<number | null>(null);

  const setFetchTimestamp = () => {
    lastFetch.value = new Date().getTime();
  };

  const authStore = useAuthStore();

  // const userId = ref<null | string>(null);

  const registerCoach = async (data: NewCoachData) => {
    const coachData: CoachInterface = {
      // id: data.id;
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    const id = authStore.userId;
    const token = authStore.token;

    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/coaches/${id}.json?auth=${token}`,
      {
        method: "PUT",
        body: JSON.stringify(coachData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to register coach.");
    }

    const newCoach: CoachInterface = {
      ...coachData,
      id,
    };
    coaches.value.push(newCoach);
  };

  const setCoaches = (payload: CoachInterface[]) => {
    coaches.value = payload;
  };

  const isCoach = computed(() => {
    const id = authStore.userId;
    return coaches.value.some((coach) => coach.id === id);
  });

  const shouldUpdate = computed(() => {
    if (!lastFetch.value) return true;
    const currentTime = new Date().getTime();
    return (currentTime - lastFetch.value) / 1000 > 60;
  });

  const loadCoaches = async (refresh = false) => {
    if (!refresh && !shouldUpdate.value) return;

    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/coaches.json`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch coaches.");
    }

    const responseData = await response.json();

    const loadedCoaches: CoachInterface[] = [];

    for (const key in responseData) {
      const coach: CoachInterface = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        areas: responseData[key].areas,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
      };
      // Avoid duplicates
      if (!coaches.value.some((c) => c.id === key)) {
        loadedCoaches.push(coach);
      }
    }

    coaches.value.push(...loadedCoaches);
    lastFetch.value = new Date().getTime();
  };
  return {
    coaches,
    lastFetch,
    registerCoach,
    shouldUpdate,
    isCoach,
    loadCoaches,
    setCoaches,
    setFetchTimestamp,
  };
});
