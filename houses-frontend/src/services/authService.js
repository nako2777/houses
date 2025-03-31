import { fetchSessionCookie, fetchTokenFromLocation, loginWithToken, fetchCsrfToken } from '../utils/authTokenFetcher';
import { useStore } from '../store/index';
export async function authenticateUser() {
  try {
    const { location } = await fetchSessionCookie();
    const token = await fetchTokenFromLocation(location);
    const email = useStore.email; // Replace with actual email retrieval method
    const password = useStore.password; // Replace with actual password
    const takeCsrfTokenLocation = await loginWithToken(email, password, token);
    const csrfToken = await fetchCsrfToken(takeCsrfTokenLocation);
    return csrfToken;
  } catch (error) {
    console.error('Error in authentication process:', error);
    throw error;
  }
}
