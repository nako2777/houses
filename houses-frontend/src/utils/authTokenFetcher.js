import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'qs';

const ORIGIN = 'https://itandi-accounts.com';
const REFERER = 'https://itandi-accounts.com/login?client_id=itandi_bb&redirect_uri=https%3A%2F%2Fitandibb.com%2Fitandi_accounts_callback&response_type=code&state=50487d263d3718068434040d219520b9d070ad93af960bbaf4fe972c5a573817';

export async function fetchAuthToken() {
  try {
    const response = await axios.get('/itandi/login?client_id=itandi_bb&redirect_uri=https%3A%2F%2Fitandibb.com%2Fitandi_accounts_callback&response_type=code&state=982ac82fc72765ed28f38e3131c2b5d92a4d04bd08c8571ee3ea6fcf8baa53b6', {
      headers: {
        'Origin': ORIGIN,
        'Referer': REFERER
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
        'Origin': ORIGIN,
        'Referer': REFERER
      }
    });

    return loginResponse.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}
