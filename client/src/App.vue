<script setup lang="ts">
// Root application component
</script>

<template>
  <div id="wedding-app" class="min-h-screen">
    <router-view />
  </div>
</template>

<style>
/* Global resets and typography */
:root {
  --color-primary: #8b263e;
  --color-primary-light: #b0415d;
  --color-gold: #c5a059;
  --color-gold-light: #dfc288;
  --color-bg-ivory: #faf7f2;
  --color-text-dark: #2c2523;
  --color-text-muted: #6b6360;
  --font-serif: "Cinzel", "Playfair Display", Georgia, serif;
  --font-sans: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
  --font-script: "Great Vibes", "Alex Brush", cursive;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg-ivory);
  color: var(--color-text-dark);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}
</style>
