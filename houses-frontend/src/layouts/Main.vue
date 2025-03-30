<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class=" text-white header-right-align" height-hint="98">
      <Header></Header>
    </q-header>

    <q-page-container>
      <router-view />
      <div>
        <!-- <p>Account: {{ store.account }}</p>
        <p>Password: {{ store.password }}</p> -->
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import Itandibb from '../class/itandibb';
import { useStore } from '../store';

export default {
  name: 'Main',
  async mounted() {
    const store = useStore();
    const itandibb = new Itandibb();
    try {
      await itandibb.init();
      store.setItandibbInstance(itandibb);
      console.log('Itandibb instance stored in Pinia:', itandibb);
    } catch (error) {
      console.error('Error initializing Itandibb in Main.vue:', error);
    }
  }
};
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
