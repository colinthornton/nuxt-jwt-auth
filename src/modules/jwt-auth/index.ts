import {
  addImports,
  addRouteMiddleware,
  createResolver,
  defineNuxtModule,
} from "nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "jwt-auth",
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Force SPA mode
    nuxt.options.ssr = false;

    // Middeware for ensuring auth token is available in local storage
    addRouteMiddleware({
      name: "jwt-auth",
      path: resolve("./runtime/middleware/jwt-auth.global.ts"),
      global: true,
    });

    // Composable functions for interacting with module (login, logout, fetch, etc.)
    addImports({
      name: "useJwtAuth",
      as: "useJwtAuth",
      from: resolve("./runtime/composables/useJwtAuth.ts"),
    });
  },
});
