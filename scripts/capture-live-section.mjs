#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';

const PRESETS = {
  hero: '#section-0',
  contract: '#section-2',
  contacts: '#section-3',
};

const DEFAULT_URL_CANDIDATES = [
  'http://127.0.0.1:5500/',
  'http://127.0.0.1:5173/santino-frontend/',
  'http://127.0.0.1:5173/',
  'http://127.0.0.1:8080/',
];

function printHelp() {
  console.log(`
Usage:
  node scripts/capture-live-section.mjs [options]

Options:
  --url <url>            Live Server URL (optional)
  --preset <name>        hero | contract | contacts (default: contract)
  --selector <css>       CSS selector for custom section/element
  --all                  Capture all presets (hero, contract, contacts)
  --out-dir <path>       Output folder (default: ScreenShots/auto-sections)
  --label <text>         Custom label in filename
  --viewport <WxH>       Example: 1920x1080 (default: 1920x1080)
  --wait-ms <ms>         Extra wait after navigation (default: 1200)
  --watch                Repeat screenshots in a loop
  --interval <ms>        Delay between loops in watch mode (default: 5000)
  --full-page            Screenshot full page instead of section clip
  --headed               Run browser in headed mode
  --help                 Show this help

Examples:
  node scripts/capture-live-section.mjs --preset contract
  node scripts/capture-live-section.mjs --all --url http://127.0.0.1:5173/santino-frontend/
  node scripts/capture-live-section.mjs --selector "#section-2" --label before-fix
  node scripts/capture-live-section.mjs --preset contacts --watch --interval 7000
`);
}

function parseArgs(argv) {
  const options = {
    url: '',
    preset: 'contract',
    selector: '',
    all: false,
    outDir: 'ScreenShots/auto-sections',
    label: '',
    viewport: '1920x1080',
    waitMs: 1200,
    watch: false,
    interval: 5000,
    fullPage: false,
    headed: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const [key, valueFromEquals] = token.split('=');
    const nextValue =
      valueFromEquals !== undefined && valueFromEquals !== '' ? valueFromEquals : argv[i + 1];

    switch (key) {
      case '--url':
        options.url = nextValue || '';
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--preset':
        options.preset = (nextValue || '').toLowerCase();
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--selector':
        options.selector = nextValue || '';
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--out-dir':
        options.outDir = nextValue || options.outDir;
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--label':
        options.label = nextValue || '';
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--viewport':
        options.viewport = nextValue || options.viewport;
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--wait-ms':
        options.waitMs = Number(nextValue) || options.waitMs;
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--interval':
        options.interval = Number(nextValue) || options.interval;
        if (valueFromEquals === undefined) i += 1;
        break;
      case '--all':
        options.all = true;
        break;
      case '--watch':
        options.watch = true;
        break;
      case '--full-page':
        options.fullPage = true;
        break;
      case '--headed':
        options.headed = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        break;
    }
  }

  return options;
}

function parseViewport(raw) {
  const match = /^(\d+)x(\d+)$/i.exec(raw.trim());
  if (!match) return { width: 1920, height: 1080 };
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function makeTimestamp(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function resolveUrl(providedUrl) {
  if (providedUrl) return providedUrl;

  for (const candidate of DEFAULT_URL_CANDIDATES) {
    try {
      const response = await fetch(candidate, { method: 'GET' });
      if (response.ok) return candidate;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(
    `Не удалось определить живой URL. Передайте его явно через --url. Проверенные адреса: ${DEFAULT_URL_CANDIDATES.join(', ')}`
  );
}

async function activateSlideIfNeeded(page, selector) {
  return page.evaluate((targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return { ok: false, reason: `Selector not found: ${targetSelector}` };

    const slide = target.closest('.swiper-slide') || target;
    const slides = Array.from(
      document.querySelectorAll('.main-swiper > .swiper-wrapper > .swiper-slide')
    );
    const index = slides.indexOf(slide);

    if (index < 0) return { ok: false, reason: 'Slide index not found for selector' };

    if (window.swiper && typeof window.swiper.slideTo === 'function') {
      window.swiper.slideTo(index, 0, false);
    } else {
      slide.scrollIntoView({ block: 'start' });
    }

    document.body.dataset.activeSection = String(index);
    return { ok: true, index };
  }, selector);
}

async function captureSection(page, options, target) {
  await page.goto(options.url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(options.waitMs);

  const activation = await activateSlideIfNeeded(page, target.selector);
  if (!activation.ok) throw new Error(activation.reason);

  if (typeof activation.index === 'number') {
    await page
      .waitForFunction((idx) => document.body.dataset.activeSection === String(idx), activation.index, {
        timeout: 8_000,
      })
      .catch(() => {});
  }

  const locator = page.locator(target.selector).first();
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  const labelPart = target.label ? `_${slugify(target.label)}` : '';
  const fileName = `${makeTimestamp()}_${slugify(target.name)}${labelPart}.png`;
  const filePath = path.resolve(options.outDir, fileName);

  if (options.fullPage) {
    await page.screenshot({ path: filePath, fullPage: true });
  } else {
    await locator.screenshot({ path: filePath });
  }

  const metaPath = filePath.replace(/\.png$/i, '.json');
  const meta = {
    createdAt: new Date().toISOString(),
    url: options.url,
    selector: target.selector,
    preset: target.name,
    viewport: options.viewport,
    fullPage: options.fullPage,
    screenshot: path.basename(filePath),
  };
  await fs.writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

  console.log(`[snap] ${target.name}: ${filePath}`);
  return { filePath, metaPath };
}

function buildTargets(options) {
  if (options.all) {
    return Object.entries(PRESETS).map(([name, selector]) => ({
      name,
      selector,
      label: options.label,
    }));
  }

  if (options.selector) {
    return [
      {
        name: options.preset || 'custom',
        selector: options.selector,
        label: options.label,
      },
    ];
  }

  const selector = PRESETS[options.preset];
  if (!selector) {
    throw new Error(
      `Неизвестный --preset "${options.preset}". Доступно: ${Object.keys(PRESETS).join(', ')}`
    );
  }

  return [
    {
      name: options.preset,
      selector,
      label: options.label,
    },
  ];
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  options.url = await resolveUrl(options.url);
  const viewport = parseViewport(options.viewport);
  const targets = buildTargets(options);
  await fs.mkdir(path.resolve(options.outDir), { recursive: true });

  const browser = await chromium.launch({ headless: !options.headed });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  console.log(`[snap] URL: ${options.url}`);
  console.log(`[snap] Output: ${path.resolve(options.outDir)}`);
  console.log(
    `[snap] Targets: ${targets.map((target) => `${target.name}(${target.selector})`).join(', ')}`
  );

  try {
    do {
      for (const target of targets) {
        await captureSection(page, options, target);
      }

      if (!options.watch) break;
      console.log(`[snap] watch mode: wait ${options.interval}ms`);
      await delay(options.interval);
    } while (true);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`[snap] Error: ${error.message}`);
  process.exitCode = 1;
});

