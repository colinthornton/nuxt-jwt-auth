<script setup lang="ts">
const { useFetch } = useJwtAuth();

const { data } = useFetch("/api/protected");
</script>

<template>
  <h1>About</h1>
  <pre><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
  <NuxtLink to="/">Home</NuxtLink>
</template>
