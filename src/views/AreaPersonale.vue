<template>
  <div class="page-box">
    <h2>Area Personale 👤</h2>
    <p>Benvenuto nella tua area riservata.</p>
    
    <div v-if="utente" class="user-details">
      <p><strong>Email del Professore:</strong> {{ utente.email }}</p>
      <p><strong>ID Utente Firebase:</strong> {{ utente.uid }}</p>
    </div>
    
    <!-- I tuoi compagni potranno implementare qui la modifica dei dati -->
  </div>
</template>

<script setup>
// Riceve le informazioni sul prof passate da Home.vue
defineProps(['utente']);
</script>

<style scoped>
.page-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.user-details {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-left: 4px solid #ff6b6b;
  border-radius: 4px;
}
</style>