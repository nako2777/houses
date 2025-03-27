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
import { fetchSessionCookie, fetchTokenFromLocation, loginWithToken } from '../utils/authTokenFetcher';

export default {
  name: 'Main',
  async mounted() {
    try {
      const { _cloud_chintai_base_session, location } = await fetchSessionCookie();
      // const token = await fetchTokenFromLocation(location);
      const email = 'your-email@example.com'; // Replace with actual email
      const password = 'your-password'; // Replace with actual password
      // const loginResponse = await loginWithToken(email, password, token);
      console.log('Login response:', loginResponse);
    } catch (error) {
      console.error('Error in authentication process:', error);
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
