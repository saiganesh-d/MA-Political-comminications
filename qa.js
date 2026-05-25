// QA helper: render index.html with the installed Chrome, measure sections, screenshot.
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const width = parseInt(process.argv[2] || '1920', 10);
const outFull = process.argv[3] || 'C:\\Temp\\pcqa\\render_full.png';
const fileUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
    defaultViewport: { width, height: 1200 },
  });
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 600));

  const rows = await page.evaluate(() => {
    const sel = ['header.site-header', '.hero', '.stat-strip', 'section', 'footer.site-footer'];
    const seen = new Set();
    const out = [];
    sel.forEach(s => document.querySelectorAll(s).forEach(el => {
      if (seen.has(el)) return; seen.add(el);
      const r = el.getBoundingClientRect();
      out.push({
        cls: (el.className || el.tagName).toString().split(' ').slice(0, 2).join('.'),
        top: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
      });
    }));
    out.sort((a, b) => a.top - b.top);
    return { rows: out, docH: document.documentElement.scrollHeight };
  });

  console.log('DOC HEIGHT:', rows.docH);
  rows.rows.forEach(r => console.log(String(r.top).padStart(6), 'h=' + String(r.h).padStart(5), r.cls));

  await page.screenshot({ path: outFull, fullPage: true });
  console.log('SHOT:', outFull);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
