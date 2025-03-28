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
import { fetchSessionCookie, fetchTokenFromLocation, loginWithToken, fetchCsrfToken } from '../utils/authTokenFetcher';

export default {
  name: 'Main',
  async mounted() {
    try {
      const { location } = await fetchSessionCookie();
      const token = await fetchTokenFromLocation(location);
      const email = 'info@aspiration-jpestate.com'; // Replace with actual email
      const password = 'asp111673'; // Replace with actual password
      const takeCsrfTokenLocation = await loginWithToken(email, password, token);
      console.log(takeCsrfTokenLocation)
      const csrfToken = await fetchCsrfToken(takeCsrfTokenLocation);
      console.log('Fetched CSRF token:', csrfToken);
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
