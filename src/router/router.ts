import { createRouter, createWebHistory } from "vue-router";

import CoachDetail from "@/pages/coaches/CoachDetail.vue";
import CoachesList from "@/pages/coaches/CoachesList.vue";
import CoachRegistration from "@/pages/coaches/CoachRegistration.vue";
import ContactCoach from "@/pages/requests/ContactCoach.vue";
import RequestReceived from "@/pages/requests/RequestReceived.vue";
import NotFound from "@/pages/NotFound.vue";
import UserAuth from "@/pages/auth/UserAuth.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/coaches" },
    { path: "/coaches", component: CoachesList },
    {
      path: "/coaches/:id",
      component: CoachDetail,
      props: true,
      // prettier ignore
      children: [
        {
          path: "contact",
          component: () => import("@/pages/requests/ContactCoach.vue"),
          name: "coach-contact",
        },
      ],
    },
    // prettier-ignore
    { path: "/register", component: CoachRegistration, meta: { requiresAuth: true }},
    // prettier-ignore
    { path: "/requests", component: RequestReceived, meta: 
    { requiresAuth: true }},
    // prettier-ignore
    { path: "/auth", component: UserAuth, meta: 
    { requiresUnauth: true }},
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/auth");
  } else if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    next("/coaches");
  } else {
    next();
  }
});

export default router;
