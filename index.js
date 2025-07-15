const puppeteer = require('puppeteer-extra');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const mid = 'Etwg8kgy'; // Thay bằng id phim
const embedUrl = `https://www.rophim.me/xem-phim/bo-5-sieu-dang-cap.Etwg8kgy?ver=1`;

async function getM3u8 () {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  let m3u8Link = null;

  // Lắng nghe các response trả về
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.m3u8')) {
      m3u8Link = url;
    }
  });

  try {
    await page.goto(embedUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    // Đợi đến 10s cho link m3u8 xuất hiện
    await new Promise(resolve => setTimeout(resolve, 10000));

    if (m3u8Link) {
      return m3u8Link;
    } else {
      return "";
    }
  } catch (err) {
    console.error('🚫 Lỗi khi truy cập:', err.message);
  }

  await browser.close();
};

app.get('/m3u8', async (req, res) => {
  const link = await getM3u8();
  res.json({ m3u8: link });
});

app.get('/', async (req, res) => {
  res.json({ "A": "b" });
});

app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
