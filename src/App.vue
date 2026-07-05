<template>
  <router-view v-slot="{ Component, route }">
    <component
      :is="Component"
      :utente="datiUtente"
      @logout="gestisciLogout"
      @login-success="gestisciLoginSuccesso"
    />
  </router-view>
</template>

<script setup>
import { ref } from 'vue';

const datiUtente = ref(null);

const gestisciLoginSuccesso = (utente) => {
  datiUtente.value = utente;
};

const gestisciLogout = () => {
  datiUtente.value = null;
};
</script>