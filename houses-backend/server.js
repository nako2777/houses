const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/fetch-auth-token', async (req, res) => {
  try {
    const response = await axios.get('https://itandi-accounts.com/login?client_id=itandi_bb&redirect_uri=https%3A%2F%2Fitandibb.com%2Fitandi_accounts_callback&response_type=code&state=982ac82fc72765ed28f38e3131c2b5d92a4d04bd08c8571ee3ea6fcf8baa53b6');
    const $ = cheerio.load(response.data);
    const token = $('input[name="authenticity_token"]').val();
    res.json({ token });
  } catch (error) {
    console.error('Error fetching authenticity token:', error);
    res.status(500).json({ error: 'Failed to fetch authenticity token' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
