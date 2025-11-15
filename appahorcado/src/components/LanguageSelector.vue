<script setup lang="ts">
import type { Language } from '../composables/useHangman'

defineProps<{
  currentLanguage: Language
}>()

const emit = defineEmits<{
  changeLanguage: [lang: Language]
}>()
</script>

<template>
  <div class="language-selector" role="group" aria-label="Language selector">
    <button
      class="lang-btn"
      :class="{ active: currentLanguage === 'es' }"
      @click="emit('changeLanguage', 'es')"
      :aria-pressed="currentLanguage === 'es'"
      aria-label="Cambiar a español"
    >
      🇪🇸 ES
    </button>
    <button
      class="lang-btn"
      :class="{ active: currentLanguage === 'en' }"
      @click="emit('changeLanguage', 'en')"
      :aria-pressed="currentLanguage === 'en'"
      aria-label="Switch to English"
    >
      🇬🇧 EN
    </button>
  </div>
</template>

<style scoped>
.language-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.lang-btn {
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #3498db;
  background-color: #fff;
  color: #3498db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.lang-btn:hover {
  background-color: #ebf5fb;
  transform: translateY(-1px);
}

.lang-btn.active {
  background-color: #3498db;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.lang-btn:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .lang-btn {
    padding: 6px 12px;
    font-size: 14px;
    min-width: 70px;
  }
}
</style>
