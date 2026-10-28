// Renders the 1200×630 social preview cards (Open Graph / Twitter) for each UI theme.
//   bun run og:generate
// Output: public/og-image.png (classic) and public/og-image-signal.png (signal).
// Copy mirrors src/data/personal.ts and src/themes/signal/content.ts — update both together.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const site = 'arjun-prakash.is-a.dev';
const name = 'Arjun Prakash';
const role = 'Full Stack Developer';
const stack = ['React', 'TypeScript', 'ASP.NET Core', 'EF Core', 'SQL Server', 'PostgreSQL'];

const page = (fonts, css, body) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  ${css}
</style></head><body>${body}</body></html>`;

const pills = (cls) => stack.map((s) => `<span class="${cls}">${s}</span>`).join('');

const cards = {
  classic: page(
    'family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&family=JetBrains+Mono:wght@500',
    `
    body { background: #0b1120; color: #cbd5e1; font-family: Inter, sans-serif; padding: 72px 80px;
      background-image:
        radial-gradient(ellipse 70% 70% at 0% 0%, rgba(59,130,246,.28), transparent 60%),
        radial-gradient(ellipse 60% 70% at 100% 0%, rgba(139,92,246,.24), transparent 60%);
      display: flex; flex-direction: column; justify-content: space-between; }
    .top { display: flex; align-items: center; gap: 18px; }
    .logo { width: 64px; height: 64px; border-radius: 16px; display: grid; place-items: center;
      background: linear-gradient(135deg,#3b82f6,#8b5cf6); color: #fff; font: 800 22px 'Plus Jakarta Sans'; }
    .site { font: 500 22px 'JetBrains Mono', monospace; color: #94a3b8; }
    h1 { font: 800 96px/1 'Plus Jakarta Sans', sans-serif; color: #f8fafc; letter-spacing: -.03em; }
    .role { margin-top: 18px; font: 700 48px 'Plus Jakarta Sans'; background: linear-gradient(135deg,#60a5fa,#a78bfa);
      -webkit-background-clip: text; color: transparent; }
    .pills { display: flex; flex-wrap: wrap; gap: 12px; }
    .pill { font: 500 22px 'JetBrains Mono', monospace; color: #cbd5e1; padding: 8px 18px; border-radius: 999px;
      background: #171d2b; border: 1px solid rgba(255,255,255,.12); }`,
    `<div class="top"><div class="logo">AP</div><div class="site">${site}</div></div>
     <div><h1>${name}</h1><div class="role">${role}</div></div>
     <div class="pills">${pills('pill')}</div>`,
  ),

  signal: page(
    'family=Syne:wght@700;800&family=Hanken+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500',
    `
    body { background: #0f1115; color: #a9a39a; font-family: 'Hanken Grotesk', sans-serif; padding: 68px 80px;
      background-image:
        radial-gradient(circle at 92% 8%, rgba(255,107,74,.30), transparent 42%),
        radial-gradient(circle at 70% 110%, rgba(63,213,193,.14), transparent 45%);
      display: flex; flex-direction: column; justify-content: space-between; }
    .top { display: flex; justify-content: space-between; align-items: center; }
    .logo { font: 800 40px Syne, sans-serif; color: #f4eee6; letter-spacing: -.02em; }
    .logo b { color: #ff6b4a; }
    .site { font: 500 22px 'JetBrains Mono', monospace; color: #8a847b; }
    h1 { font: 800 72px/1.04 Syne, sans-serif; color: #f4eee6; letter-spacing: -.03em; max-width: 1000px; }
    h1 em { font-style: normal; color: #ff8a6e; }
    .foot { display: flex; justify-content: space-between; align-items: flex-end; }
    .who { font: 600 28px 'Hanken Grotesk'; color: #f4eee6; }
    .who span { display: block; margin-top: 6px; font: 500 20px 'JetBrains Mono', monospace; color: #8a847b;
      text-transform: uppercase; letter-spacing: .12em; }
    .pills { display: flex; gap: 10px; }
    .pill { font: 500 19px 'JetBrains Mono', monospace; color: #0f1115; background: #3fd5c1; padding: 6px 14px; border-radius: 999px; }
    .pill + .pill { color: #a9a39a; background: transparent; border: 1px solid #3d424d; }`,
    `<div class="top"><div class="logo">AP<b>.</b></div><div class="site">${site}</div></div>
     <h1>I build SaaS platforms where every tenant sees <em>only its own data.</em></h1>
     <div class="foot"><div class="who">${name}<span>${role}</span></div>
       <div class="pills">${pills('pill').split('</span>').slice(0, 3).join('</span>')}</span></div></div>`,
  ),
};

const out = {
  classic: '../public/og-image.png',
  signal: '../public/og-image-signal.png',
};

// Prefer the system Chrome (no download); fall back to Playwright's bundled Chromium.
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [theme, html] of Object.entries(cards)) {
    await tab.setContent(html, { waitUntil: 'networkidle' });
    await tab.evaluate(() => document.fonts.ready);
    const path = fileURLToPath(new URL(out[theme], import.meta.url));
    await tab.screenshot({ path, type: 'png' });
    console.log(`✓ ${theme} → ${path}`);
  }
} finally {
  await browser.close();
}
