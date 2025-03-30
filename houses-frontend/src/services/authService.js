import { fetchSessionCookie, fetchTokenFromLocation, loginWithToken, fetchCsrfToken } from '../utils/authTokenFetcher';

export async function authenticateUser() {
  try {
    const { location } = await fetchSessionCookie();
    const token = await fetchTokenFromLocation(location);
    const email = 'info@aspiration-jpestate.com'; // Replace with actual email
    const password = 'asp111673'; // Replace with actual password
    const takeCsrfTokenLocation = await loginWithToken(email, password, token);
    const csrfToken = await fetchCsrfToken(takeCsrfTokenLocation);
    return csrfToken;
  } catch (error) {
    console.error('Error in authentication process:', error);
    throw error;
  }
}
