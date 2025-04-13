import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export type Request = {
  id: string;
  coachId: string;
  userEmail: string;
  message: string;
  userId: string;
};

export const useRequests = defineStore("requests", () => {
  const requests = ref<Request[]>([]);

  const addRequest = (request: Request) => {
    requests.value.push(request);
  };

  const setRequests = (requestList: Request[]) => {
    requests.value = requestList;
  };

  const authStore = useAuthStore();

  const receivedRequests = computed(() => {
    const coachId = authStore.userId;
    return requests.value.filter((req) => req.coachId === coachId);
  });

  // Send a request to a coach
  const contactCoach = async (
    coachId: string,
    email: string,
    message: string
  ) => {
    const newRequest = {
      userEmail: email,
      message,
      userId: authStore.userId,
    };

    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/requests/${coachId}.json`,
      {
        method: "POST",
        body: JSON.stringify(newRequest),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to send request.");
    }

    addRequest(<any>{
      ...newRequest,
      id: responseData.name,
      coachId,
    });
  };

  // Fetch requests for the currently logged-in coach
  const fetchRequests = async () => {
    const coachId = authStore.userId;
    const token = authStore.token;

    if (!token || !coachId) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `https://find-a-coach-55f09-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch requests.");
    }

    const loadedRequests: Request[] = [];

    for (const requestId in responseData) {
      const req = responseData[requestId];
      loadedRequests.push({
        id: requestId,
        coachId: coachId,
        userEmail: req.userEmail,
        message: req.message,
        userId: req.senderId,
      });
    }

    setRequests(loadedRequests);
  };

  const hasRequests = () => requests.value.length > 0;

  return {
    requests,
    receivedRequests,
    contactCoach,
    fetchRequests,
    hasRequests,
  };
});
