import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCoaches } from "./coaches";

type Request = {
  id?: string;
  coachId?: string;
  userEmail: string;
  message: string;
};

export type Payload = {
  coachId: string;
  email: string;
  message: string;
};

export const useRequests = defineStore("requests", () => {
  const coachesStore = useCoaches();
  const requests = ref<Request[]>([]);

  const contactCoach = async (payload: Payload) => {
    const newRequest: Request = {
      userEmail: payload.email,
      message: payload.message,
    };
    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
      {
        method: "POST",
        body: JSON.stringify(newRequest),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to send request."
      );
      throw error;
    }

    newRequest.id = responseData.name;
    newRequest.coachId = payload.coachId;

    requests.value.push(newRequest);
  };

  const fetchRequests = async () => {
    const coachId = coachesStore.userId;
    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/requests/${coachId}.json`
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to fetch requests."
      );
      throw error;
    }

    const loadedRequests: Request[] = [];

    for (const key in responseData) {
      const request: Request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };
      loadedRequests.push(request);
    }

    requests.value = loadedRequests;
  };

  const receivedRequests = computed(() => {
    const coachId = coachesStore.userId;
    return requests.value.filter((req) => req.coachId == coachId);
  });

  const hasRequests = computed(() => receivedRequests.value.length > 0);

  return {
    contactCoach,
    receivedRequests,
    hasRequests,
    requests,
    fetchRequests,
  };
});
