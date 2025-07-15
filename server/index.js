const express = require('express');
const axios = require('axios');
const app = express();

app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(url, {
      headers: {
        'Referer': 'https://rophim.me/',
        'User-Agent': 'Mozilla/5.0',
      }
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Proxy error');
  }
});

app.listen(3000, () => {
  console.log('Proxy server chạy ở cổng 3000');
});