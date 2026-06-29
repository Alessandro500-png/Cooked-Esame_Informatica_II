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

<style>
/* Stili globali per resettare i margini di tutta l'app */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #fafafa;
}
</style>