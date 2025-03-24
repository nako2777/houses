<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class=" text-white header-right-align" height-hint="98">
      <Header></Header>
    </q-header>

    <q-page-container>
      <router-view />
      <div>
        <p>Account: {{ store.account }}</p>
        <p>Password: {{ store.password }}</p>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from 'src/components/Header.vue';
import { useStore } from '../store'
import { fetchAuthToken, login } from 'src/utils/authTokenFetcher'

const store = useStore()

onMounted(async () => {
  try {
    const token = await fetchAuthToken();
    console.log('Fetched authenticity token:', token);
    const loginResponse = await login(store.account, store.password, token);
    console.log('Login response:', loginResponse);
  } catch (error) {
    console.error('Failed to fetch authenticity token or log in:', error);
  }
});
</script>

<style scoped>
.q-header {
  background-color: #fef6e4; /* Background color from the palette */
  color: #001858; /* Text color from the palette */
  padding: 10px 20px; /* Added padding */
}

.header-right-align {
  display: flex;
  justify-content: flex-end;
}
</style>
