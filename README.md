# Vue 3 + Vite

This project loads recipes from the Spoonacular API using a local environment key.

## Setup for each teammate

1. Clone the repository.
2. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and replace `your_spoonacular_api_key_here` with your own Spoonacular API key:

   ```env
   VITE_SPOONACULAR_KEY=la_tua_chiave_spoonacular
   ```

4. Install dependencies and start the app:

   ```bash
   npm install
   npm run dev
   ```

5. Open the browser at the local address shown by Vite.

## Notes

- Each person should use their own Spoonacular key.
- Do not commit `.env` to GitHub.
- `.env` is ignored by git, so only `.env.example` should be shared in the repo.
