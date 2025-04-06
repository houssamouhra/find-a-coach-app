import { computed, ref } from "vue";
import { defineStore } from "pinia";

export interface CoachInterface {
  id?: string;
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
  const lastFetch = ref<number | null>(null);

  const setFetchTimestamp = () => {
    lastFetch.value = new Date().getTime();
  };

  const coaches = ref<CoachInterface[]>([
    {
      id: "c1",
      firstName: "Houssam",
      lastName: "Ouhra",
      areas: ["frontend"],
      description:
        "I'm Houssam and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
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

  const userId = ref<string>("c4");

  const registerCoach = async (data: NewCoachData) => {
    const coachData: CoachInterface = {
      // id: userId.value,
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/coaches/${userId.value}.json`,
      {
        method: "PUT",
        body: JSON.stringify(coachData),
      }
    );

    if (!response.ok) {
      //error ...
    }

    const newCoach: CoachInterface = {
      ...coachData,
      id: userId.value,
    };
    coaches.value.push(newCoach);
  };

  const setCoaches = (payload: CoachInterface[]) => {
    coaches.value = payload;
  };

  const isCoach = computed(() => {
    return coaches.value.some((coach) => coach.id === userId.value);
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
    userId,
    shouldUpdate,
    isCoach,
    loadCoaches,
    setCoaches,
    setFetchTimestamp,
  };
});
