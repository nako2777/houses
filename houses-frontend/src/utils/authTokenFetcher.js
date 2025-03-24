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
        // 'Origin': ORIGIN,
        // 'Referer': REFERER,
        // ':authority': 'itandi-accounts.com',
        // ':method': 'POST',
        // ':path': '/login',
        // ':scheme': 'https',
        // 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        // 'accept-encoding': 'gzip, deflate, br, zstd',
        // 'accept-language': 'ja,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        // 'cache-control': 'max-age=0',
        // 'content-length': '205',
        // 'cookie': '_gcl_au=1.1.1943278710.1739447121; _yjsu_yjad=1739447121.f3b18247-db25-4c00-a5ac-3b000e5df78b; __lt__cid=6dc51de3-4729-4957-84d5-e5bc30521faf; _fbp=fb.1.1739447121776.663369710717590482; hubspotutk=0a90146b568207d7e8769152d103e1b8; _gid=GA1.2.637608605.1742738641; __hssrc=1; __lt__sid=686600c1-c40ba4ef; __hstc=109821786.0a90146b568207d7e8769152d103e1b8.1739447121836.1742819360473.1742823645008.4; _itandi-accounts_session=GlUECL3QrXdyzLeOh3D2Jn2VaXOYR2QTTsjZw6K8vppuvB73RnqdWSzn63jTuZrFIZIOF3KdEx6zBlE5i%2B71zur0tlQpekX5bIcjwPMWrZvnn5m7WT%2FiqX5lxvNkxHhcBbv9fVSGSx5DBH1aR%2B0bisKWZxP55S9raU2dyMjyUS6X4pnVtzShmZrsPhHjP%2BQDbYQMN8CkZOZma0HykyGlYEBx%2FLM80TO55P%2Bk6OIXeCiE0qu%2BxVTmFMlYrUMFKrYK0HYq89FGBJntVuYxrx%2F2lVX4t0Pl4t8a%2BMC%2BtSF%2Bu0M%2F5ftlMvE4NE9y7RVUQuw4cI%2BK3iQGvw1MhCZrUrqwKBlL9h3D2yXZUkMlW081vRCk8yIQ1OHKssIqWHiVWm6qs0Wt7NajQ5scj4CS4RbQGFRsrzN5pzW1ggORjJazTjkNHb%2B4u5N5ymRfmNERWOvlmWtJBXyXemY%2FrLN0L6CvvWl2sQFcWv13LyAUcvZrDwFSf4K9ctYDZZgAJqf41thjEcMy26YIMEGAl1nI4C3%2Fa7e5Yb9obqpFjy6USJZuvosHzdv2lif%2B9iYtcuYO44fWzlyYV2EcFaWmq20AaufoTc%2FtJmLkAIzvJke3aZgUShOXXSJb0rqxGD3RX5YV3tGROXY1xbM58qIB4jaD8yg%3D--UBB3dF%2BPOA3lvffw--Gkt32RjmaIl5crQhkzUFGQ%3D%3D; AWSALB=5mJ6GuuLLN3pB8zLxT3gJjvXbc3ynvVBNLc6y94evMSMllFvznhc4ZTjfUQ5LbveuUHBMp9wmUL4IhkRCXWe9ZxZFL+n7CbtsyATID0yT4bSxrajwHEO1V4PeTmx; AWSALBCORS=5mJ6GuuLLN3pB8zLxT3gJjvXbc3ynvVBNLc6y94evMSMllFvznhc4ZTjfUQ5LbveuUHBMp9wmUL4IhkRCXWe9ZxZFL+n7CbtsyATID0yT4bSxrajwHEO1V4PeTmx; _gat_UA-38027115-44=1; _ga=GA1.1.498879944.1739447122; _ga_GG81PD8TFX=GS1.1.1742823644.4.1.1742825271.0.0.0; _ga_53TH60EQML=GS1.2.1742823644.4.1.1742825271.0.0.0; __hssc=109821786.4.1742823645008',
        // 'origin': 'https://itandi-accounts.com',
        // 'priority': 'u=0, i',
        // 'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        // 'sec-ch-ua-mobile': '?0',
        // 'sec-ch-ua-platform': '"Windows"',
        // 'sec-fetch-dest': 'document',
        // 'sec-fetch-mode': 'navigate',
        // // 'sec-fetch-site': 'same-origin',
        // 'sec-fetch-user': '?1',
        // 'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
      }
    });

    return loginResponse.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}
