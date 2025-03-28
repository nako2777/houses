import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'qs';
import userConfig from 'src/config/userConfig';

export async function fetchSessionCookie() {
  try {
    const response = await axios.get('/api/api/internal/sessions/new', {
      maxRedirects: 0, // Prevent automatic redirection
      validateStatus: (status) => status === 302 || status === 200, // Accept 302 as a valid status
    });
    console.log(response);
    // const _cloud_chintai_base_session = response.data._cloud_chintai_base_session.split('=')[1].split(';')[0];
    const location = response.data.redirectUrl;
    // console.log('Fetched _cloud_chintai_base_session cookie:', _cloud_chintai_base_session);
    console.log('Redirect location:', location);
    return { location };
  } catch (error) {
    console.error('Error fetching session cookie:', error);
    throw error;
  }
}

export async function fetchTokenFromLocation(location) {
  const requestLocation = location.replace('https://itandi-accounts.com', '/itandi');
  console.log(requestLocation)
  try {
    const response = await axios.get(requestLocation, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      }
    });
    const $ = cheerio.load(response.data);
    const token = $('input[name="authenticity_token"]').val();
    console.log('Fetched authenticity token from location:', token);
    return token;
  } catch (error) {
    console.error('Error fetching token from location:', error);
    throw error;
  }
}

export async function loginWithToken(email, password, token) {
  try {
    const loginResponse = await axios.post('/itandi/login', qs.stringify({
      authenticity_token: token,
      email: userConfig.itandi.email,
      password: userConfig.itandi.password,
      commit: "ログイン"
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
      }
    });

    return loginResponse.data.redirectUrl;
  } catch (error) {
    console.error('Error logging in with token:', error);
    throw error;
  }
}

export async function fetchCsrfToken(location) {

  location = location.replace('https://itandibb.com', '/api/api/internal/sessions');
  try {
    const response = await axios.get(location, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      }
    });
    const $ = cheerio.load(response.data);
    const csrfToken = $('meta[name="csrf-token"]').attr('content');
    console.log('Fetched CSRF token:', csrfToken);
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

