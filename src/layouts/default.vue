<script setup lang="ts">
const { logout, isLoggedIn } = useJwtAuth();
</script>

<template>
  <header>
    <button v-if="isLoggedIn" @click="logout()">Logout</button>
  </header>
  <slot />
</template>
