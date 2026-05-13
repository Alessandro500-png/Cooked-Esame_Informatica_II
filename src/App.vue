<script setup>
import { ref, onMounted } from 'vue'

const recipes = ref([])
const error = ref(null)

const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

async function fetchRecipes() {
  try {
    if (!apiKey) {
      throw new Error('Missing Spoonacular API key. Copy .env.example to .env and add VITE_SPOONACULAR_KEY.')
    }

    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=6`
    const response = await fetch(url)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`API Error ${response.status}: ${text}`)
    }
    const data = await response.json()
    recipes.value = data.recipes
  } catch (err) {
    error.value = err.message
    console.error('Fetch error:', err)
  }
}

onMounted(fetchRecipes)
</script>

<template>
  <div class="container py-5">
    <h1>Random Recipes</h1>
    
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div v-for="recipe in recipes" :key="recipe.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <img :src="recipe.image" class="card-img-top" :alt="recipe.title">
          <div class="card-body">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <p class="card-text">
              <small class="text-muted">
                Ready in {{ recipe.readyInMinutes }} minutes
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
