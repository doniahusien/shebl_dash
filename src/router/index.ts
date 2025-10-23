// Composables

import { createRouter, createWebHistory } from "vue-router";
import { computed, ref, watch } from "vue";

import { useAppAuth } from "@/store/auth";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/default/Default.vue"),
      meta: {
        auth: true,
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("@/views/Home.vue"),
          meta: {
            auth: true,
          },
        },
        {
          path: "sections",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/sections/Home.vue"),
          children: [
            {
              path: "",
              name: "sections",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/sections/index.vue"),
            },
            {
              path: "show/:id",
              props: true,
              name: "show-section",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/sections/Show.vue"),
            },
            {
              path: "form/:id",
              props: true,
              name: "edit-section",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/sections/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-section",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/sections/Form.vue"),
            },
          ],
        },

        {
          path: "our_features",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/our_features/Home.vue"),
          children: [
            {
              path: "",
              name: "features",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/our_features/index.vue"),
            },
            {
              path: "show/:id",
              props: true,
              name: "show-features",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/our_features/Show.vue"),
            },
            {
              path: "form/:id",
              props: true,
              name: "edit-features",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/our_features/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-features",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/our_features/Form.vue"),
            },
          ],
        },
        {
          path: "faq",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/faq/Home.vue"),
          children: [
            {
              path: "",
              name: "faq",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/faq/index.vue"),
            },
            {
              path: "show/:id",
              props: true,
              name: "show-faq",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/faq/Show.vue"),
            },
            {
              path: "form/:id",
              props: true,
              name: "edit-faq",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/faq/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-faq",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/faq/Form.vue"),
            },
          ],
        },
        {
          path: "why_us",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/why_us/Home.vue"),
          children: [
            {
              path: "",
              name: "why_us",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/why_us/index.vue"),
            },
            {
              path: "show/:id",
              props: true,
              name: "show-why_us",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/why_us/Show.vue"),
            },
            {
              path: "form/:id",
              props: true,
              name: "edit-why_us",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/why_us/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-why_us",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/why_us/Form.vue"),
            },
          ],
        },
         {
          path: "about",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/about/Home.vue"),
          children: [
            {
              path: "",
              props: true,
              name: "about",
              meta: {
                auth: true,
              },
              component: () => import("@/views/company/about/Form.vue"),
            },
          ],
        },

        {
          path: "settings",
          name: "settings",
          component: () => import("@/views/settings/index.vue"),
          meta: {
            auth: true,
          },
        },

        {
          path: "/:pathMatch(.*)*",
          name: "not-found",
          component: () => import("@/views/NotFound.vue"),
        },
        {
          path: "/profile",
          component: () => import("@/views/profile/index.vue"),
          children: [
            {
              path: "",
              name: "profile",
              meta: {
                auth: true,
              },
              component: () => import("@/views/profile/Account.vue"),
            },
           
            {
              path: "reset-password",
              name: "resetProfilePassword",
              meta: {
                auth: true,
              },
              component: () => import("@/views/profile/Password.vue"),
            },
          ],
        },

        {
          path: "/403",
          name: "not-authorized",
          component: () => import("@/views/403.vue"),
        },
        {
          path: "/402",
          name: "too-many-requests",
          component: () => import("@/views/402.vue"),
        },
      ],
    },

    {
      path: "/auth",
      component: () => import("@/layouts/auth/Auth.vue"),
      children: [
        {
          path: "login",
          name: "login",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/Login.vue"),
        },
        {
          path: "forget-password",
          name: "forget-password",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/ForgetPassword.vue"),
        },
        {
          path: "reset-password",
          name: "changePassword",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/ResetPassword.vue"),
        },

        {
          path: "verify",
          name: "verify",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/Verify.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const appAuth = useAppAuth();
  const isLoggedIn = computed(() =>
    localStorage.getItem("jwt_token_shebl_global")
  );


  if (to.meta.auth && !isLoggedIn.value) {
    next("/auth/login");
    return;
  } else if (to.meta.guest && isLoggedIn.value) {
    next("/");
    return;
  }

  next();
});

export default router;
