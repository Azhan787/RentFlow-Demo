# RentFlow demo — fix notes

## Fixed in this package

- Removed the duplicate `const outstanding` declaration in `src/App.jsx` inside `OverviewPage`.
- Kept the existing outstanding-balance calculation and dashboard display unchanged.

## Run

```bash
npm install
npm run dev
```

## Verification note

The source was checked for duplicate `outstanding` declarations and JSX/JavaScript parsing diagnostics. A full Vite production build could not be run in the file-generation environment because npm dependency installation did not complete. Run `npm install` and `npm run build` locally to verify the full build in your environment.

This remains a front-end demonstration using sample data and browser storage, not a production SaaS backend.
