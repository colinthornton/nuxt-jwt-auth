<script setup lang="ts">
definePageMeta({
  auth: false,
});

const email = ref("me@example.com");
const password = ref("hunter2");
const { login } = useJwtAuth();
</script>

<template>
  <h1>Login</h1>
  <form @submit.prevent="login({ email, password })">
    <label for="login.email">Email</label>
    <input v-model="email" id="login.email" type="email" required />
    <label for="login.password">Password</label>
    <input v-model="password" id="login.password" type="password" required />
    <button>Login</button>
  </form>
</template>
