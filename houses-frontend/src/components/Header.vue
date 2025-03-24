<template>
    
    <q-btn round icon="settings" flat dense class="q-mr-sm" size="lg" @click="toggleSettings">
    </q-btn>
    <SettingsDialog ref="settingsDialog" />
</template>

<script setup>
import { ref } from 'vue'
import SettingsDialog from './SettingsDialog.vue'

const settingsDialog = ref(null)
const toggleSettings = () => {
    settingsDialog.value.toggle()
}
</script>

<style scoped>
.q-btn {
  background-color: #f582ae; /* Button color from the palette */
  color: #001858; /* Button text color from the palette */
}
</style>