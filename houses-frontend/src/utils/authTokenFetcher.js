import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'qs';

const ORIGIN = 'https://itandi-accounts.com';
const REFERER = 'https://itandi-accounts.com/login?client_id=itandi_bb&redirect_uri=https%3A%2F%2Fitandibb.com%2Fitandi_accounts_callback&response_type=code&state=50487d263d3718068434040d219520b9d070ad93af960bbaf4fe972c5a573817';

export async function fetchSessionCookie() {
  try {
    console.log(1);
    const response = await axios.get('/api/api/internal/sessions/new', {
      maxRedirects: 0, // Prevent automatic redirection
      validateStatus: (status) => status === 302 || status === 200, // Accept 302 as a valid status
    });
    console.log(2);
    const _cloud_chintai_base_session = response.headers['set-cookie'].find(cookie => cookie.startsWith('_cloud_chintai_base_session'));
    const location = response.headers['location'];
    console.log('Fetched _cloud_chintai_base_session cookie:', _cloud_chintai_base_session);
    console.log('Redirect location:', location);
    return { _cloud_chintai_base_session, location };
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
        'Origin': ORIGIN,
        'Referer': REFERER,
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
      email: email,
      password: password,
      commit: "ログイン"
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
      }
    });

    return loginResponse.data;
  } catch (error) {
    console.error('Error logging in with token:', error);
    throw error;
  }
}

export async function fetchAuthToken() {
  try {
    const response = await axios.get('/itandi/login?client_id=itandi_bb&redirect_uri=https%3A%2F%2Fitandibb.com%2Fitandi_accounts_callback&response_type=code&state=982ac82fc72765ed28f38e3131c2b5d92a4d04bd08c8571ee3ea6fcf8baa53b6', {
      headers: {
        'Origin': ORIGIN,
        'Referer': REFERER,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      }
    });
    const $ = cheerio.load(response.data);
    const token = $('input[name="authenticity_token"]').val();
    console.log('Fetched authenticity token:', token);
    return token;
  } catch (error) {
    console.error('Error fetching authenticity token:', error);
    throw error;
  }
}

export async function login(email, password, token) {
  try {
    const loginResponse = await axios.post('/itandi/login', qs.stringify({
      authenticity_token: token,
      email: email,
      password: password,
      commit: "ログイン"
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
      }
    });

    return loginResponse.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}
