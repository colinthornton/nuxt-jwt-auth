import { useRoute, navigateTo, useFetch, useLazyFetch } from "nuxt/app";
import { ref, watch, computed, unref } from "vue";

export function useJwtAuth() {
  return {
    /** Log in with credentials */
    login,
    /** Clear auth token and navigate to login page */
    logout,
    /** True when auth token available */
    isLoggedIn,
    /** Nuxt $fetch with authentication */
    $fetch: $jwtAuthFetch,
    /** Nuxt useFetch with authentication */
    useFetch: jwtAuthUseFetch,
    /** Nuxt useLazyFetch with authentication */
    useLazyFetch: jwtAuthUseLazyFetch,
  };
}

const key = "jwt-auth.token";
const token = ref<string | null>(window.localStorage.getItem(key));
watch(token, () => {
  if (token.value) {
    window.localStorage.setItem(key, token.value);
  } else {
    window.localStorage.removeItem(key);
  }
});

const isLoggedIn = computed(() => Boolean(token.value));

async function login(credentials: { email: string; password: string }) {
  const res = await $fetch("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
  token.value = (res as { token: string }).token;
  const route = useRoute();

  const redirect = route.query.redirect;
  if (typeof redirect === "string") {
    navigateTo(redirect);
  } else {
    navigateTo("/");
  }
}

function logout({ redirect } = { redirect: false }) {
  token.value = null;
  const route = useRoute();
  navigateTo({
    path: "/login",
    query: {
      redirect: redirect ? route.fullPath : undefined,
    },
  });
}

const logoutOnUnauthorized = ({
  response,
}: {
  response: { status: number };
}) => {
  if (response.status === 401) {
    logout({ redirect: true });
  }
};

function $jwtAuthFetch(...parameters: Parameters<typeof $fetch>) {
  return $fetch(parameters[0], {
    ...parameters[1],
    headers: {
      ...parameters[1]?.headers,
      authorization: `Bearer ${token.value}`,
    },
    onResponseError(ctx) {
      logoutOnUnauthorized(ctx);
      parameters[1]?.onResponseError?.(ctx);
    },
  });
}

function jwtAuthUseFetch(...parameters: Parameters<typeof useFetch>) {
  return useFetch(parameters[0], {
    ...parameters[1],
    headers: {
      ...parameters[1]?.headers,
      authorization: `Bearer ${token.value}`,
    },
    onResponseError(ctx) {
      logoutOnUnauthorized(ctx);
      unref(parameters[1]?.onResponseError)?.(ctx);
    },
  });
}

function jwtAuthUseLazyFetch(...parameters: Parameters<typeof useLazyFetch>) {
  return useLazyFetch(parameters[0], {
    ...parameters[1],
    headers: {
      ...parameters[1]?.headers,
      authorization: `Bearer ${token.value}`,
    },
    onResponseError(ctx) {
      logoutOnUnauthorized(ctx);
      unref(parameters[1]?.onResponseError)?.(ctx);
    },
  });
}
