<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-logo" @click="tabAttiva = 'ricerca'">Cooked 🧑‍🍳</div>
      <div class="nav-links">
        <button :class="{ active: tabAttiva === 'ricerca' }" @click="tabAttiva = 'ricerca'">Home / Ricerca</button>
        <button :class="{ active: tabAttiva === 'risultati' }" @click="tabAttiva = 'risultati'">Risultati</button>
        <button :class="{ active: tabAttiva === 'dettagli' }" @click="tabAttiva = 'dettagli'">Dettagli Ricetta</button>
        <button :class="{ active: tabAttiva === 'profilo' }" @click="tabAttiva = 'profilo'">Area Personale</button>
        <button class="logout-btn" @click="$emit('logout')">Esci</button>
      </div>
    </nav>

    <main class="main-content">
      <div v-if="tabAttiva === 'ricerca'" class="page-box">
        <h2>Cerca la tua Ricetta</h2>
        <p>Spazio per la barra di ricerca e i filtri avanzati...</p>
        </div>

      <Risultati v-else-if="tabAttiva === 'risultati'" />

      <DettagliRicetta v-else-if="tabAttiva === 'dettagli'" />

      <AreaPersonale v-else-if="tabAttiva === 'profilo'" :utente="utente" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Importiamo tutte le pagine della scaletta
import Risultati from './Risultati.vue';
import DettagliRicetta from './DettagliRicetta.vue';
import AreaPersonale from './AreaPersonale.vue';

// Riceve i dati del professore da App.vue
defineProps(['utente']);
defineEmits(['logout']);

// Tab iniziale: mostra la schermata di ricerca
const tabAttiva = ref('ricerca');
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.nav-logo {
  font-size: 22px;
  font-weight: bold;
  color: #ff6b6b;
  cursor: pointer;
}

.nav-links button {
  background: none;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-links button.active {
  background-color: #ff6b6b;
  color: white;
  font-weight: bold;
}

.nav-links button:hover:not(.active) {
  background-color: #f0f0f0;
}

.nav-links .logout-btn {
  background-color: #ee5253;
  color: white;
}

.main-content {
  flex: 1;
  padding: 30px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.page-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>