# Auto Section Screenshots

This folder stores automatically generated screenshots from the local Live Server.

Generator script: `scripts/capture-live-section.mjs`

## Naming

- `YYYY-MM-DD_HH-mm-ss_<preset>[_label].png`
- Same name with `.json` metadata is created рядом с изображением.

Examples:

- `2026-03-28_12-10-15_contract.png`
- `2026-03-28_12-10-15_contract_before-fix.png`

## Quick start

From project root:

```bash
npm run snap:section -- --preset contract
npm run snap:all
```

Custom URL:

```bash
npm run snap:section -- --url http://127.0.0.1:5173/santino-frontend/ --preset hero
```

Watch mode (continuous capture):

```bash
npm run snap:section -- --preset contacts --watch --interval 7000
```

