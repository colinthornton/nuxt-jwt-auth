import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useJwtAuth } from "../composables/useJwtAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.meta.auth === false) return;
  if (isLoggedIn.value) return;
  return navigateTo("/login");
});

const { isLoggedIn } = useJwtAuth();
