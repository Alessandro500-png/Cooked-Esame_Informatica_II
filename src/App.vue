<template>
  <Login v-if="!isLoggedIn" @login-success="gestisciLoginSuccesso" />

  <Home v-else @logout="gestisciLogout" />
</template>

<script setup>
import { ref } from 'vue';
import Login from './views/Login.vue'; 
import Home from './views/Home.vue'; // <-- Corretto! Rimosso il "views" di troppo

// Stato per capire se il prof è dentro o fuori
const isLoggedIn = ref(false);
const datiUtente = ref(null);

// Questa funzione si attiva quando Login.vue lancia l'evento 'login-success'
const gestisciLoginSuccesso = (utente) => {
  console.log("Il prof è entrato ufficialmente!", utente.uid);
  datiUtente.value = utente;
  isLoggedIn.value = true; // Sostituisce la schermata di login con la Home
};

// Funzione opzionale se vorrai gestire il logout da qui
const gestisciLogout = () => {
  isLoggedIn.value = false;
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