<script setup lang="ts">
defineProps<{
  failCount: number
}>()
</script>

<template>
  <div class="hangman-figure">
    <svg
      viewBox="0 0 200 250"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hangman drawing"
    >
      <!-- Base -->
      <line x1="10" y1="230" x2="150" y2="230" stroke="#333" stroke-width="4" />

      <!-- Pole vertical -->
      <line x1="50" y1="230" x2="50" y2="20" stroke="#333" stroke-width="4" />

      <!-- Pole horizontal -->
      <line x1="50" y1="20" x2="130" y2="20" stroke="#333" stroke-width="4" />

      <!-- Rope -->
      <line x1="130" y1="20" x2="130" y2="50" stroke="#333" stroke-width="2" />

      <!-- Head -->
      <circle
        v-if="failCount >= 1"
        cx="130"
        cy="70"
        r="20"
        stroke="#d32f2f"
        stroke-width="3"
        fill="none"
        class="fade-in"
      />

      <!-- Body -->
      <line
        v-if="failCount >= 2"
        x1="130"
        y1="90"
        x2="130"
        y2="150"
        stroke="#d32f2f"
        stroke-width="3"
        class="fade-in"
      />

      <!-- Left arm -->
      <line
        v-if="failCount >= 3"
        x1="130"
        y1="110"
        x2="100"
        y2="130"
        stroke="#d32f2f"
        stroke-width="3"
        class="fade-in"
      />

      <!-- Right arm -->
      <line
        v-if="failCount >= 4"
        x1="130"
        y1="110"
        x2="160"
        y2="130"
        stroke="#d32f2f"
        stroke-width="3"
        class="fade-in"
      />

      <!-- Left leg -->
      <line
        v-if="failCount >= 5"
        x1="130"
        y1="150"
        x2="110"
        y2="190"
        stroke="#d32f2f"
        stroke-width="3"
        class="fade-in"
      />

      <!-- Right leg -->
      <line
        v-if="failCount >= 6"
        x1="130"
        y1="150"
        x2="150"
        y2="190"
        stroke="#d32f2f"
        stroke-width="3"
        class="fade-in"
      />
    </svg>
  </div>
</template>

<style scoped>
.hangman-figure {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
}

svg {
  width: 100%;
  height: auto;
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
